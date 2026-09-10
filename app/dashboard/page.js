import Link from 'next/link';
import { getCurrentCustomer } from '@/lib/dal';
import { listActiveProducts, getCustomerOrders } from '@/lib/db';
import { CUTOFF_HOUR } from '@/lib/constants';
import OrderPanel from '@/components/OrderPanel';
import LogoutButton from '@/components/LogoutButton';

const fmt = (n) => Number(n).toLocaleString('en-US');
const STATUS_FA = { pending: 'در انتظار تحویل', delivered: 'تحویل شده', cancelled: 'لغو شده' };

export default async function DashboardPage() {
  const customer = await getCurrentCustomer();
  const products = await listActiveProducts();
  const orders = await getCustomerOrders(customer.id);

  return (
    <>
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[var(--brand-dark)]">🌿 تله‌بار</Link>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">خوش اومدید، {customer.name}</h1>
            <p className="text-sm text-[var(--muted)]">{customer.shop_name}</p>
          </div>
          <div className="bg-white border border-[var(--border)] rounded-xl px-5 py-3 text-center">
            <p className="text-xs text-[var(--muted)]">مانده حساب</p>
            <p className="text-lg font-bold text-[var(--brand-dark)]">{fmt(customer.balance)} تومان</p>
          </div>
        </div>

        <section>
          <h2 className="font-bold mb-3">لیست امروز</h2>
          <OrderPanel products={products} cutoffHour={CUTOFF_HOUR} businessType={customer.business_type} />
        </section>

        <section>
          <h2 className="font-bold mb-3">سفارش‌های اخیر</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">هنوز سفارشی ثبت نکردید.</p>
          ) : (
            <div className="bg-white border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4 text-sm">
                  <span>سفارش #{o.id}</span>
                  <span className="text-[var(--muted)]">{o.created_at}</span>
                  <span>{fmt(o.total)} تومان</span>
                  <span
                    className={
                      o.status === 'delivered'
                        ? 'text-[var(--brand)]'
                        : o.status === 'cancelled'
                          ? 'text-red-600'
                          : 'text-[var(--accent)]'
                    }
                  >
                    {STATUS_FA[o.status] || o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
