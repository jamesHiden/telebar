import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listActiveProducts } from '@/lib/db';
import { CATEGORIES, CUTOFF_HOUR } from '@/lib/constants';
import { getOptionalCustomer } from '@/lib/dal';
import SiteHeader from '@/components/SiteHeader';
import OrderPanel from '@/components/OrderPanel';

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.value === slug);
  if (!category) notFound();

  const [allProducts, customer] = await Promise.all([listActiveProducts(), getOptionalCustomer()]);
  const products = allProducts.filter((p) => p.category === slug);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-[var(--brand-light)]/60 border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
            <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--brand)] transition">
              🌿 تله‌بار / بازگشت به صفحه اصلی
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--brand-dark)]">{category.label}</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              قیمت‌ها برای همه قابل مشاهده‌ست
              {!customer && ' — برای ثبت سفارش باید وارد حساب‌تون بشید'}.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
          <OrderPanel products={products} cutoffHour={CUTOFF_HOUR} isGuest={!customer} />
        </div>
      </main>
    </>
  );
}
