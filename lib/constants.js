export const BUSINESS_TYPES = [
  { value: 'sandwich', label: 'ساندویچی / پروتئینی' },
  { value: 'juice', label: 'آب‌میوه و آب‌هویج‌گیری' },
  { value: 'restaurant', label: 'رستوران' },
  { value: 'other', label: 'سایر' },
];

export function businessTypeLabel(value) {
  return BUSINESS_TYPES.find((t) => t.value === value)?.label || value;
}

export const CUTOFF_HOUR = Number(process.env.CUTOFF_HOUR || 21);

export const DEFAULT_PRODUCTS = [
  { name: 'پیاز', price: 28000, qty: 300, unit: 'کیلوگرم' },
  { name: 'سیب‌زمینی', price: 32000, qty: 300, unit: 'کیلوگرم' },
  { name: 'گوجه‌فرنگی', price: 38000, qty: 200, unit: 'کیلوگرم' },
  { name: 'خیار', price: 45000, qty: 150, unit: 'کیلوگرم' },
  { name: 'هویج', price: 30000, qty: 250, unit: 'کیلوگرم' },
  { name: 'سیر', price: 120000, qty: 50, unit: 'کیلوگرم' },
  { name: 'قارچ', price: 85000, qty: 80, unit: 'کیلوگرم' },
  { name: 'فلفل دلمه', price: 60000, qty: 60, unit: 'کیلوگرم' },
  { name: 'جعفری و سبزی معطر', price: 15000, qty: 100, unit: 'بسته' },
  { name: 'کاهو', price: 25000, qty: 100, unit: 'عدد' },
];
