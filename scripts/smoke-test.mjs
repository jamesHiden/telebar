import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.local', import.meta.url).pathname, quiet: true });

const {
  createCustomer,
  getCustomerById,
  upsertProduct,
  createOrder,
  getAggregatedPendingItems,
  getPendingOrdersWithCustomers,
  markOrderDelivered,
  recordPayment,
  listCustomers,
} = await import('../lib/db.js');
const dbModule = await import('../lib/db.js');
await dbModule.ensureSchema();
const pool = dbModule.getPool();

await pool.query('TRUNCATE payments, order_items, orders, products, customers RESTART IDENTITY CASCADE');

const customer = await createCustomer({
  phone: '09121110000',
  passwordHash: 'x',
  name: 'تست مشتری',
  shopName: 'ساندویچی تست',
  businessType: 'sandwich',
  address: 'آدرس تست',
  lat: 32.65,
  lng: 51.66,
});
console.assert(customer.balance === 0, 'مانده اولیه باید صفر باشه');

const cucumber = await upsertProduct('خیار', 45000, 200, 'کیلوگرم');
const onion = await upsertProduct('پیاز', 28000, 300, 'کیلوگرم');

const cart = [
  { name: cucumber.name, unit: cucumber.unit, unitPrice: cucumber.price, quantity: 4, subtotal: 180000 },
  { name: onion.name, unit: onion.unit, unitPrice: onion.price, quantity: 3, subtotal: 84000 },
];
const orderId = await createOrder(customer.id, cart);
console.assert(orderId > 0, 'سفارش باید ساخته بشه');

const aggregated = await getAggregatedPendingItems();
console.assert(aggregated.length === 2, `باید ۲ قلم کالا جمع بشه، شد ${aggregated.length}`);

const pending = await getPendingOrdersWithCustomers();
console.assert(pending.length === 1 && pending[0].total === 264000, `جمع سفارش باید ۲۶۴۰۰۰ باشه، شد ${pending[0]?.total}`);

const delivered = await markOrderDelivered(orderId);
console.assert(delivered.status === 'delivered', 'سفارش باید تحویل‌شده بشه');

let updated = await getCustomerById(customer.id);
console.assert(updated.balance === 264000, `بدهی باید ۲۶۴۰۰۰ باشه، شد ${updated.balance}`);

await recordPayment(customer.id, 100000, 'تست پرداخت');
updated = await getCustomerById(customer.id);
console.assert(updated.balance === 164000, `بدهی بعد از پرداخت باید ۱۶۴۰۰۰ باشه، شد ${updated.balance}`);

const customers = await listCustomers();
console.assert(customers.length === 1, 'باید ۱ مشتری ثبت‌شده باشه');

console.log('همه‌ی تست‌های منطق دیتابیس با موفقیت پاس شدن ✅');
await pool.end();
