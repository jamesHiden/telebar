import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.local', import.meta.url).pathname, quiet: true });

import bcrypt from 'bcryptjs';

const { getCustomerByPhone, createCustomer, upsertProduct, getPool } = await import('../lib/db.js');
const pool = getPool();
const { DEFAULT_PRODUCTS } = await import('../lib/constants.js');

const adminPhone = process.env.ADMIN_PHONE;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminPhone || !adminPassword) {
  console.error('ADMIN_PHONE و ADMIN_PASSWORD باید در .env.local تنظیم شده باشن.');
  process.exit(1);
}

let admin = await getCustomerByPhone(adminPhone);
if (!admin) {
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  admin = await createCustomer({
    phone: adminPhone,
    passwordHash,
    name: 'مدیر',
    shopName: 'تله‌بار',
    businessType: 'other',
    address: '',
    lat: null,
    lng: null,
  });
  await pool.query('UPDATE customers SET is_admin = TRUE WHERE id = $1', [admin.id]);
  console.log(`حساب ادمین ساخته شد ✅ (شماره: ${adminPhone})`);
} else {
  console.log('حساب ادمین از قبل وجود داره، رد شد.');
}

for (const p of DEFAULT_PRODUCTS) {
  await upsertProduct(p.name, p.price, p.qty, p.unit, p.category, p.emoji, p.image || null);
}
console.log(`${DEFAULT_PRODUCTS.length} کالای پیش‌فرض ثبت شد ✅`);

const DISCONTINUED = ['سبزی خوردن', 'سبزی قورمه', 'ریحان'];
const { rows: toRemove } = await pool.query(
  `SELECT id, name FROM products WHERE name = ANY($1::text[]) AND active`,
  [DISCONTINUED]
);
for (const row of toRemove) {
  await pool.query('UPDATE products SET active = FALSE WHERE id = $1', [row.id]);
  console.log(`محصول حذف‌شده غیرفعال شد: ${row.name}`);
}

await pool.end();
