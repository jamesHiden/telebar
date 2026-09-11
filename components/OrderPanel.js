'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitOrder } from '@/app/actions/orders';
import { CATEGORIES } from '@/lib/constants';
import ProductCard from '@/components/ProductCard';

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

export default function OrderPanel({
  products,
  cutoffHour,
  businessType,
  isGuest = false,
  flat = false,
  emptyMessage = 'فعلاً کالایی برای امروز ثبت نشده. کمی بعد دوباره سر بزنید.',
}) {
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
  const groups = useMemo(
    () => (flat ? [{ value: 'flat', label: null, items: products, isPrimary: false }] : groupByCategory(products, businessType)),
    [products, businessType, flat]
  );

  function handleQuantityChange(productId, value) {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
    setResult(null);
  }

  function handleSubmit() {
    if (cart.length === 0) return;
    if (isGuest) {
      setResult({ needsAuth: true });
      return;
    }
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
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cart.length > 0 ? 'pb-28' : ''}>
      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.value}>
            {g.label && (
              <h3
                className={
                  g.isPrimary
                    ? 'text-sm font-bold text-[var(--accent)] mb-3'
                    : 'text-sm font-bold text-[var(--muted)] mb-3'
                }
              >
                {g.label}
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {g.items.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={quantities[p.id]}
                  onChange={(v) => handleQuantityChange(p.id, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {result?.needsAuth && (
        <div className="mt-6 bg-white border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--brand-dark)]">
          برای ثبت سفارش اول باید{' '}
          <Link href="/register" className="underline font-medium">ثبت‌نام</Link> یا{' '}
          <Link href="/login" className="underline font-medium">وارد</Link> بشید. دیدن قیمت‌ها نیازی به ثبت‌نام نداره.
        </div>
      )}
      {result?.orderId && (
        <div className="mt-6 bg-[var(--brand-light)] border border-[var(--brand)] rounded-xl p-4 text-sm text-[var(--brand-dark)]">
          سفارش #{result.orderId} با موفقیت ثبت شد ✅
          {result.pastCutoff && ' (برای فردا شب/پس‌فردا صبح تحویل داده میشه)'}
        </div>
      )}
      {result?.error && <p className="mt-4 text-sm text-red-600">{result.error}</p>}

      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-20 border-t border-[var(--border)] bg-white/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[var(--muted)]">
                {cart.length} قلم — تا ساعت {cutoffHour}:۰۰ برای فردا صبح
              </p>
              <p className="font-bold text-lg text-[var(--brand-dark)]">{fmt(total)} تومان</p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="bg-[var(--accent)] text-white px-6 sm:px-10 py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 shrink-0"
            >
              {isPending ? 'در حال ثبت...' : 'ثبت سفارش'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
