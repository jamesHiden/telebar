import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env.local', import.meta.url).pathname, quiet: true });

import bcrypt from 'bcryptjs';

const { getCustomerByPhone, createCustomer, upsertProduct } = await import('../lib/db.js');
const pool = (await import('../lib/db.js')).default;
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
    shopName: 'سبزی روز',
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
  await upsertProduct(p.name, p.price, p.qty, p.unit);
}
console.log(`${DEFAULT_PRODUCTS.length} کالای پیش‌فرض ثبت شد ✅`);

await pool.end();
