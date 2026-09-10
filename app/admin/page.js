import Link from 'next/link';
import { verifyAdminSession } from '@/lib/dal';
import { listActiveProducts, getAggregatedPendingItems, getPendingOrdersWithCustomers, listCustomers } from '@/lib/db';
import AdminProductForm from '@/components/AdminProductForm';
import AdminOrdersPanel from '@/components/AdminOrdersPanel';
import AdminCustomersPanel from '@/components/AdminCustomersPanel';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminPage() {
  await verifyAdminSession();

  const [products, aggregated, orders, customers] = await Promise.all([
    listActiveProducts(),
    getAggregatedPendingItems(),
    getPendingOrdersWithCustomers(),
    listCustomers(),
  ]);

  return (
    <>
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[var(--brand-dark)]">🌿 تله‌بار — پنل مدیریت</Link>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 space-y-10">
        <section>
          <h2 className="font-bold mb-3">قیمت و موجودی امروز</h2>
          <AdminProductForm products={products} />
        </section>

        <section>
          <h2 className="font-bold mb-3">سفارش‌های امروز</h2>
          <AdminOrdersPanel aggregated={aggregated} orders={orders} />
        </section>

        <section>
          <h2 className="font-bold mb-3">مشتریان و حساب‌وکتاب</h2>
          <AdminCustomersPanel customers={customers} />
        </section>
      </main>
    </>
  );
}
