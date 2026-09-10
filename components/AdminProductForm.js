'use client';

import { useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProductAction, deactivateProductAction } from '@/app/actions/admin';
import { CATEGORIES } from '@/lib/constants';
import ProductThumb from '@/components/ProductThumb';

const fmt = (n) => Number(n).toLocaleString('en-US');
const inputClass = 'w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]';

export default function AdminProductForm({ products }) {
  const [state, action, pending] = useActionState(upsertProductAction, undefined);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeactivate(id) {
    startTransition(async () => {
      await deactivateProductAction(id);
      router.refresh();
    });
  }

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    items: products.filter((p) => p.category === c.value),
  })).filter((g) => g.items.length > 0);
  const uncategorized = products.filter((p) => !CATEGORIES.some((c) => c.value === p.category));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form action={action} className="bg-white border border-[var(--border)] rounded-xl p-5 space-y-3">
        <h3 className="font-bold">افزودن / ویرایش کالا</h3>
        <input name="name" placeholder="نام کالا (مثلاً خیار)" className={inputClass} required />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" placeholder="قیمت (تومان)" className={inputClass} required />
          <input name="qty" type="number" placeholder="موجودی" className={inputClass} required />
        </div>
        <input name="unit" placeholder="واحد (پیش‌فرض: کیلوگرم)" className={inputClass} />

        <select name="category" className={inputClass} defaultValue="all">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input name="emoji" placeholder="ایموجی (اختیاری، مثلاً 🥒)" className={inputClass} maxLength={4} />
          <input name="imageUrl" placeholder="لینک عکس (اختیاری)" className={inputClass} dir="ltr" />
        </div>
        <p className="text-xs text-[var(--muted)]">
          اگه لینک عکس بذارید همون نشون داده میشه، وگرنه ایموجی به‌جاش نمایش داده میشه.
        </p>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.success && <p className="text-sm text-[var(--brand)]">ثبت شد ✅</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[var(--accent)] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {pending ? 'در حال ثبت...' : 'ثبت کالا'}
        </button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <h3 className="font-bold mb-3">لیست فعلی کالاها</h3>
        {products.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">هنوز کالایی ثبت نشده.</p>
        ) : (
          <div className="space-y-5">
            {[...grouped, ...(uncategorized.length ? [{ value: 'other', label: 'سایر', items: uncategorized }] : [])].map((g) => (
              <div key={g.value}>
                <p className="text-xs font-bold text-[var(--muted)] mb-2">{g.label}</p>
                <div className="space-y-2">
                  {g.items.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 text-sm border-b border-[var(--border)] pb-2">
                      <ProductThumb product={p} size={32} />
                      <span className="flex-1">{p.name}</span>
                      <span className="text-[var(--muted)]">{fmt(p.price)} / {p.unit} — {p.available_qty}</span>
                      <button
                        disabled={isPending}
                        onClick={() => handleDeactivate(p.id)}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        حذف از امروز
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
