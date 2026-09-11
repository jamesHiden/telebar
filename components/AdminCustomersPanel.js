'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { recordPaymentAction } from '@/app/actions/admin';
import { businessTypeLabel } from '@/lib/constants';

const fmt = (n) => Number(n).toLocaleString('en-US');

export default function AdminCustomersPanel({ customers }) {
  const [amounts, setAmounts] = useState({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handlePay(customerId) {
    const amount = amounts[customerId];
    if (!amount) return;
    startTransition(async () => {
      await recordPaymentAction(customerId, amount);
      setAmounts((prev) => ({ ...prev, [customerId]: '' }));
      router.refresh();
    });
  }

  if (customers.length === 0) {
    return <p className="text-sm text-[var(--muted)]">هنوز مشتری‌ای ثبت‌نام نکرده.</p>;
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
      {customers.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <div>
            <p className="font-medium">
              {c.name || c.phone} — {c.shop_name || <span className="text-[var(--accent)]">پروفایل تکمیل‌نشده</span>}
            </p>
            <p className="text-[var(--muted)]">{businessTypeLabel(c.business_type)} — {c.phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={c.balance > 0 ? 'text-[var(--accent)] font-medium' : 'text-[var(--brand)]'}>
              بدهی: {fmt(c.balance)} تومان
            </span>
            <input
              type="number"
              placeholder="مبلغ پرداخت"
              value={amounts[c.id] ?? ''}
              onChange={(e) => setAmounts((prev) => ({ ...prev, [c.id]: e.target.value }))}
              className="w-28 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs"
            />
            <button
              disabled={isPending}
              onClick={() => handlePay(c.id)}
              className="text-xs bg-[var(--brand)] text-white rounded-full px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
            >
              ثبت پرداخت
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
