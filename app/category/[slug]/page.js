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
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-dark)]">{category.label}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            قیمت‌ها برای همه قابل مشاهده‌ست. برای ثبت سفارش باید وارد حساب‌تون بشید.
          </p>
        </div>
        <OrderPanel
          products={products}
          cutoffHour={CUTOFF_HOUR}
          isGuest={!customer}
        />
      </main>
    </>
  );
}
