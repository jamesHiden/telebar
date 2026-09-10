'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deliverOrderAction, deliverAllAction } from '@/app/actions/admin';

const fmt = (n) => Number(n).toLocaleString('en-US');

export default function AdminOrdersPanel({ aggregated, orders }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeliver(orderId) {
    startTransition(async () => {
      await deliverOrderAction(orderId);
      router.refresh();
    });
  }

  function handleDeliverAll() {
    startTransition(async () => {
      await deliverAllAction();
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return <p className="text-sm text-[var(--muted)]">سفارش در انتظاری وجود نداره.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-bold mb-3">جمع کل کالای لازم (برای خرید از بازار)</h3>
        <div className="space-y-2">
          {aggregated.map((row) => (
            <div key={row.product_name} className="flex justify-between text-sm border-b border-[var(--border)] pb-2">
              <span>{row.product_name}</span>
              <span className="text-[var(--muted)]">{row.total_quantity} {row.unit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">سفارش‌ها برای تحویل</h3>
          <button
            disabled={isPending}
            onClick={handleDeliverAll}
            className="text-xs bg-[var(--brand)] text-white rounded-full px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
          >
            همه تحویل شد
          </button>
        </div>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border-b border-[var(--border)] pb-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">#{o.id} — {o.customer_name} ({o.shop_name})</span>
                <button
                  disabled={isPending}
                  onClick={() => handleDeliver(o.id)}
                  className="text-xs text-[var(--brand)] hover:underline disabled:opacity-50"
                >
                  تحویل شد
                </button>
              </div>
              <p className="text-[var(--muted)] mt-1">{fmt(o.total)} تومان — {o.phone}</p>
              {o.address && <p className="text-[var(--muted)]">{o.address}</p>}
              {o.lat && o.lng && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${o.lat}&mlon=${o.lng}#map=17/${o.lat}/${o.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] text-xs"
                >
                  مشاهده روی نقشه
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
