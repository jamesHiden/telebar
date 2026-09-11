export const BUSINESS_TYPES = [
  { value: 'sandwich', label: 'فست‌فود', emoji: '🥪', category: 'sandwich' },
  { value: 'protein', label: 'پروتئینی', emoji: '🥩', category: 'sandwich' },
  { value: 'juice', label: 'آبمیوه و بستنی', emoji: '🥤', category: 'juice' },
  { value: 'restaurant', label: 'رستوران', emoji: '🍽️', category: 'restaurant' },
  { value: 'bakery', label: 'قنادی', emoji: '🍰', category: 'all' },
  { value: 'other', label: 'سایر', emoji: '🏪', category: 'all' },
];

export function businessTypeLabel(value) {
  return BUSINESS_TYPES.find((t) => t.value === value)?.label || value || 'نامشخص';
}

// دسته‌بندی محصولی که هر نوع کسب‌وکار موقع ورود بهش هدایت میشه
export function businessTypeCategory(value) {
  return BUSINESS_TYPES.find((t) => t.value === value)?.category || 'all';
}

export const CATEGORIES = [
  {
    value: 'all',
    label: 'خرید عمده',
    pitch: 'محصولات پرمصرف و پایه — برای خرید عمده',
  },
  {
    value: 'sandwich',
    label: 'فست‌فود / پروتئینی',
    pitch: 'پیشنهاد تله‌بار برای فست‌فودی‌ها و پروتئینی‌ها',
  },
  {
    value: 'juice',
    label: 'آبمیوه و بستنی',
    pitch: 'پیشنهاد تله‌بار برای آبمیوه‌بستنی‌فروشی‌ها',
  },
  {
    value: 'restaurant',
    label: 'رستوران',
    pitch: 'پیشنهاد تله‌بار برای رستوران‌ها',
  },
];

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function categoryPitch(value) {
  return CATEGORIES.find((c) => c.value === value)?.pitch || categoryLabel(value);
}

export const CUTOFF_HOUR = Number(process.env.CUTOFF_HOUR || 21);
export const DEFAULT_EMOJI = '🥬';

export const DEFAULT_PRODUCTS = [
  // خرید عمده — محصولات پرمصرف و پایه، مشترک بین همه‌ی کسب‌وکارها
  { name: 'پیاز', price: 28000, qty: 300, unit: 'کیلوگرم', category: 'all', bulk: true, emoji: '🧅', image: '/products/piaz.jpg' },
  { name: 'سیب‌زمینی', price: 32000, qty: 300, unit: 'کیلوگرم', category: 'all', bulk: true, emoji: '🥔', image: '/products/sibzamini.png' },
  { name: 'گوجه‌فرنگی', price: 38000, qty: 200, unit: 'کیلوگرم', category: 'all', bulk: true, emoji: '🍅', image: '/products/gojeh.jpg' },
  { name: 'خیار', price: 45000, qty: 150, unit: 'کیلوگرم', category: 'all', bulk: true, emoji: '🥒', image: '/products/khiar.jpg' },
  { name: 'سیر', price: 120000, qty: 50, unit: 'کیلوگرم', category: 'all', bulk: true, emoji: '🧄', image: '/products/sir.webp' },

  // فست‌فود / پروتئینی
  { name: 'کاهو', price: 25000, qty: 100, unit: 'عدد', category: 'sandwich', emoji: '🥬', image: '/products/kahoo.jpg' },
  { name: 'قارچ', price: 85000, qty: 80, unit: 'کیلوگرم', category: 'sandwich', bulk: true, emoji: '🍄', image: '/products/gharch.png' },
  { name: 'فلفل دلمه', price: 60000, qty: 60, unit: 'کیلوگرم', category: 'sandwich', emoji: '🫑', image: '/products/felfel-dalmeh.jpg' },
  { name: 'فلفل سبز تند', price: 55000, qty: 40, unit: 'کیلوگرم', category: 'sandwich', emoji: '🌶️', image: '/products/felfel-tond.jpeg' },
  { name: 'کلم سفید', price: 20000, qty: 60, unit: 'عدد', category: 'sandwich', emoji: '🥬', image: '/products/kalam-sefid.jpg' },

  // آبمیوه و بستنی
  { name: 'هویج', price: 30000, qty: 250, unit: 'کیلوگرم', category: 'juice', bulk: true, emoji: '🥕', image: '/products/havij.jpg' },
  { name: 'پرتقال', price: 42000, qty: 150, unit: 'کیلوگرم', category: 'juice', emoji: '🍊', image: '/products/porteghal.jpg' },
  { name: 'سیب قرمز', price: 48000, qty: 120, unit: 'کیلوگرم', category: 'juice', emoji: '🍎', image: '/products/sib.jpg' },
  { name: 'کرفس', price: 25000, qty: 60, unit: 'بسته', category: 'juice', emoji: '🌿', image: '/products/karafs.webp' },
  { name: 'چغندر لبویی', price: 35000, qty: 80, unit: 'کیلوگرم', category: 'juice', emoji: '🌱', image: '/products/choghondar.jpg' },
  { name: 'زنجبیل', price: 180000, qty: 20, unit: 'کیلوگرم', category: 'juice', emoji: '🫚', image: '/products/zanjebil.jpg' },
  { name: 'موز', price: 55000, qty: 100, unit: 'کیلوگرم', category: 'juice', emoji: '🍌', image: '/products/moz.jpg' },

  // رستوران
  { name: 'بادمجان', price: 40000, qty: 100, unit: 'کیلوگرم', category: 'restaurant', emoji: '🍆', image: '/products/bademjan.png' },
  { name: 'لیمو‌ترش', price: 65000, qty: 60, unit: 'کیلوگرم', category: 'restaurant', emoji: '🍋', image: '/products/limoo-torsh.jpg' },
  { name: 'کدو سبز', price: 32000, qty: 90, unit: 'کیلوگرم', category: 'restaurant', emoji: '🥒', image: '/products/kadoo-sabz.jpg' },
  { name: 'کلم قرمز', price: 28000, qty: 50, unit: 'عدد', category: 'restaurant', emoji: '🥬', image: '/products/kalam-ghermez.png' },
];
