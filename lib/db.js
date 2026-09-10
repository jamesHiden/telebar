import { Pool } from 'pg';

let pool;
function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL یا DATABASE_URL تنظیم نشده. Environment Variables را بررسی کنید.');
    }
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

let readyPromise;
function ensureSchema() {
  if (!readyPromise) {
    readyPromise = getPool().query(`
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    unit TEXT NOT NULL DEFAULT 'کیلوگرم',
    price INTEGER NOT NULL,
    available_qty REAL NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category TEXT NOT NULL DEFAULT 'all',
    emoji TEXT NOT NULL DEFAULT '🥬',
    image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'all';
  ALTER TABLE products ADD COLUMN IF NOT EXISTS emoji TEXT NOT NULL DEFAULT '🥬';
  ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    status TEXT NOT NULL DEFAULT 'pending',
    total INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'کیلوگرم',
    unit_price INTEGER NOT NULL,
    quantity REAL NOT NULL,
    subtotal INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    amount INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);
  }
  return readyPromise;
}

async function query(text, params) {
  await ensureSchema();
  return getPool().query(text, params);
}

async function withTransaction(fn) {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ---------- customers ----------

export async function getCustomerByPhone(phone) {
  const { rows } = await query('SELECT * FROM customers WHERE phone = $1', [phone]);
  return rows[0] || null;
}

export async function getCustomerById(id) {
  const { rows } = await query('SELECT * FROM customers WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createCustomer({ phone, passwordHash, name, shopName, businessType, address, lat, lng }) {
  const { rows } = await query(
    `INSERT INTO customers (phone, password_hash, name, shop_name, business_type, address, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [phone, passwordHash, name, shopName, businessType, address, lat ?? null, lng ?? null]
  );
  return rows[0];
}

export async function listCustomers() {
  const { rows } = await query('SELECT * FROM customers WHERE is_admin = FALSE ORDER BY name');
  return rows;
}

// ---------- products ----------

export async function listActiveProducts() {
  const { rows } = await query('SELECT * FROM products WHERE active ORDER BY category, name');
  return rows;
}

export async function getProduct(id) {
  const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function upsertProduct(name, price, availableQty, unit = 'کیلوگرم', category = 'all', emoji = '🥬', imageUrl = null) {
  const { rows } = await query(
    `INSERT INTO products (name, unit, price, available_qty, category, emoji, image_url, active, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW())
     ON CONFLICT (name) DO UPDATE SET
       price = EXCLUDED.price,
       available_qty = EXCLUDED.available_qty,
       unit = EXCLUDED.unit,
       category = EXCLUDED.category,
       emoji = EXCLUDED.emoji,
       image_url = EXCLUDED.image_url,
       active = TRUE,
       updated_at = NOW()
     RETURNING *`,
    [name, unit, price, availableQty, category, emoji, imageUrl]
  );
  return rows[0];
}

export async function deactivateProduct(id) {
  await query('UPDATE products SET active = FALSE WHERE id = $1', [id]);
}

// ---------- orders ----------

export async function createOrder(customerId, cartItems) {
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      'INSERT INTO orders (customer_id, status, total) VALUES ($1, $2, $3) RETURNING id',
      [customerId, 'pending', total]
    );
    const orderId = rows[0].id;
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_name, unit, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.name, item.unit, item.unitPrice, item.quantity, item.subtotal]
      );
    }
    return orderId;
  });
}

export async function getOrder(orderId) {
  const { rows } = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return rows[0] || null;
}

export async function getOrderItems(orderId) {
  const { rows } = await query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
  return rows;
}

export async function getCustomerOrders(customerId, limit = 10) {
  const { rows } = await query(
    'SELECT * FROM orders WHERE customer_id = $1 ORDER BY id DESC LIMIT $2',
    [customerId, limit]
  );
  return rows;
}

export async function getPendingOrdersWithCustomers() {
  const { rows } = await query(
    `SELECT orders.*, customers.name AS customer_name, customers.shop_name AS shop_name,
            customers.phone AS phone, customers.address AS address, customers.lat AS lat, customers.lng AS lng
     FROM orders JOIN customers ON customers.id = orders.customer_id
     WHERE orders.status = 'pending'
     ORDER BY orders.id ASC`
  );
  return rows;
}

export async function getAggregatedPendingItems() {
  const { rows } = await query(
    `SELECT product_name, unit, SUM(quantity) AS total_quantity
     FROM order_items
     JOIN orders ON orders.id = order_items.order_id
     WHERE orders.status = 'pending'
     GROUP BY product_name, unit
     ORDER BY product_name`
  );
  return rows;
}

export async function markOrderDelivered(orderId) {
  return withTransaction(async (client) => {
    const { rows } = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    const order = rows[0];
    if (!order || order.status !== 'pending') return null;
    await client.query(
      "UPDATE orders SET status = 'delivered', delivered_at = NOW() WHERE id = $1",
      [orderId]
    );
    await client.query('UPDATE customers SET balance = balance + $1 WHERE id = $2', [
      order.total,
      order.customer_id,
    ]);
    return { ...order, status: 'delivered' };
  });
}

export async function markAllPendingDelivered() {
  const { rows: pending } = await query("SELECT id FROM orders WHERE status = 'pending'");
  const delivered = [];
  for (const { id } of pending) {
    const order = await markOrderDelivered(id);
    if (order) delivered.push(order);
  }
  return delivered;
}

// ---------- payments ----------

export async function recordPayment(customerId, amount, note = '') {
  return withTransaction(async (client) => {
    await client.query('INSERT INTO payments (customer_id, amount, note) VALUES ($1, $2, $3)', [
      customerId,
      amount,
      note,
    ]);
    const { rows } = await client.query(
      'UPDATE customers SET balance = balance - $1 WHERE id = $2 RETURNING *',
      [amount, customerId]
    );
    return rows[0];
  });
}

export { getPool, ensureSchema };
