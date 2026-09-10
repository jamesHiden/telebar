'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder } from '@/app/actions/orders';
import { CATEGORIES } from '@/lib/constants';
import ProductThumb from '@/components/ProductThumb';

const fmt = (n) => Number(n).toLocaleString('en-US');

function groupByCategory(products, businessType) {
  const order = [
    ...(CATEGORIES.some((c) => c.value === businessType) ? [businessType] : []),
    'all',
    ...CATEGORIES.map((c) => c.value).filter((v) => v !== businessType && v !== 'all'),
  ];

  return order
    .map((value) => {
      const meta = CATEGORIES.find((c) => c.value === value);
      const items = products.filter((p) => p.category === value);
      const isPrimary = value === businessType;
      return { value, label: isPrimary ? `${meta?.label} (مخصوص شما)` : meta?.label, items, isPrimary };
    })
    .filter((g) => g.items.length > 0);
}

export default function OrderPanel({ products, cutoffHour, businessType }) {
  const [quantities, setQuantities] = useState({});
  const [result, setResult] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const cart = useMemo(
    () =>
      products
        .map((p) => ({ product: p, quantity: Number(quantities[p.id] || 0) }))
        .filter((line) => line.quantity > 0),
    [products, quantities]
  );

  const total = cart.reduce((sum, line) => sum + line.quantity * line.product.price, 0);
  const groups = useMemo(() => groupByCategory(products, businessType), [products, businessType]);

  function handleQuantityChange(productId, value) {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
    setResult(null);
  }

  function handleSubmit() {
    if (cart.length === 0) return;
    const payload = cart.map((line) => ({ productId: line.product.id, quantity: line.quantity }));
    startTransition(async () => {
      const res = await submitOrder(payload);
      setResult(res);
      if (res.orderId) {
        setQuantities({});
        router.refresh();
      }
    });
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-6 text-center text-[var(--muted)]">
        فعلاً کالایی برای امروز ثبت نشده. کمی بعد دوباره سر بزنید.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
      {groups.map((g) => (
        <div key={g.value}>
          <p
            className={
              g.isPrimary
                ? 'px-4 pt-4 pb-1 text-xs font-bold text-[var(--accent)]'
                : 'px-4 pt-4 pb-1 text-xs font-bold text-[var(--muted)]'
            }
          >
            {g.label}
          </p>
          <div className="divide-y divide-[var(--border)]">
            {g.items.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ProductThumb product={p} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {fmt(p.price)} تومان / {p.unit} — موجودی: {p.available_qty}
                    </p>
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  placeholder="۰"
                  value={quantities[p.id] ?? ''}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                  className="w-24 shrink-0 text-center rounded-lg border border-[var(--border)] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="p-4 bg-[var(--brand-light)]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between font-medium">
          <span>جمع کل سفارش</span>
          <span>{fmt(total)} تومان</span>
        </div>
        <p className="text-xs text-[var(--muted)]">
          سفارش تا ساعت {cutoffHour}:۰۰ برای تحویل فردا صبح ثبت میشه.
        </p>
        <button
          type="button"
          disabled={cart.length === 0 || isPending}
          onClick={handleSubmit}
          className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {isPending ? 'در حال ثبت...' : 'ثبت سفارش'}
        </button>
        {result?.error && <p className="text-sm text-red-600">{result.error}</p>}
        {result?.orderId && (
          <p className="text-sm text-[var(--brand-dark)]">
            سفارش #{result.orderId} با موفقیت ثبت شد ✅
            {result.pastCutoff && ' (برای فردا شب/پس‌فردا صبح تحویل داده میشه)'}
          </p>
        )}
      </div>
    </div>
  );
}
