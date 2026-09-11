'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { repeatLastOrder } from '@/app/actions/orders';

export default function RepeatOrderButton() {
  const [result, setResult] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      const res = await repeatLastOrder();
      if (res.needsProfile) {
        router.push('/complete-profile?next=/dashboard');
        return;
      }
      setResult(res);
      if (res.orderId) router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-white border-2 border-[var(--brand)] text-[var(--brand-dark)] px-5 py-2.5 rounded-xl font-medium hover:bg-[var(--brand-light)] transition disabled:opacity-50"
      >
        🔄 {isPending ? 'در حال ثبت...' : 'تکرار آخرین سفارش'}
      </button>
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      {result?.orderId && (
        <p className="mt-2 text-sm text-[var(--brand-dark)]">
          سفارش #{result.orderId} با همون اقلام سفارش قبلی، با قیمت امروز ثبت شد ✅
          {result.skipped?.length > 0 && ` (${result.skipped.join('، ')} دیگه موجود نیست)`}
        </p>
      )}
    </div>
  );
}
