import { searchActiveProducts } from '@/lib/db';
import { CUTOFF_HOUR } from '@/lib/constants';
import { getOptionalCustomer } from '@/lib/dal';
import SiteHeader from '@/components/SiteHeader';
import OrderPanel from '@/components/OrderPanel';

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const term = (q || '').trim();

  const [products, customer] = await Promise.all([
    term ? searchActiveProducts(term) : Promise.resolve([]),
    getOptionalCustomer(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-[var(--brand-light)]/60 border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--brand-dark)]">
              نتیجه‌ی جست‌وجو برای «{term}»
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {products.length > 0 ? `${products.length} محصول پیدا شد.` : 'محصولی با این نام پیدا نشد.'}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
          <OrderPanel
            products={products}
            cutoffHour={CUTOFF_HOUR}
            isGuest={!customer}
            flat
            emptyMessage={term ? 'محصولی با این اسم پیدا نشد — یه اسم دیگه امتحان کنید.' : 'یه چیزی برای جست‌وجو تایپ کنید.'}
          />
        </div>
      </main>
    </>
  );
}
