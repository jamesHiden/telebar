'use client';

import { Suspense, useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { completeProfile } from '@/app/actions/auth';
import { BUSINESS_TYPES } from '@/lib/constants';
import LocationPicker from '@/components/LocationPicker';

const inputClass =
  'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] bg-white';
const labelClass = 'block text-sm font-medium mb-1 text-[var(--foreground)]';
const errorClass = 'text-sm text-red-600 mt-1';

export default function CompleteProfilePage() {
  return (
    <Suspense>
      <CompleteProfileForm />
    </Suspense>
  );
}

function CompleteProfileForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [state, action, pending] = useActionState(completeProfile, undefined);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-[var(--brand-dark)]">
            🌿 تله‌بار
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--brand-dark)]">یه قدم تا ثبت اولین سفارش</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            برای اینکه بدونیم سفارش‌تون رو کجا تحویل بدیم، این اطلاعات رو کامل کنید.
          </p>
        </div>

        <form action={action} className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className={labelClass} htmlFor="name">نام و نام‌خانوادگی</label>
            <input id="name" name="name" className={inputClass} placeholder="مثلاً علی رضایی" />
            {state?.errors?.name && <p className={errorClass}>{state.errors.name}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="shopName">نام مغازه / کسب‌وکار</label>
            <input id="shopName" name="shopName" className={inputClass} placeholder="مثلاً ساندویچ رضایی" />
            {state?.errors?.shopName && <p className={errorClass}>{state.errors.shopName}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="businessType">نوع کسب‌وکار</label>
            <select id="businessType" name="businessType" className={inputClass} defaultValue="">
              <option value="" disabled>انتخاب کنید</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
              ))}
            </select>
            {state?.errors?.businessType && <p className={errorClass}>{state.errors.businessType}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="address">آدرس مغازه</label>
            <textarea id="address" name="address" rows={2} className={inputClass} placeholder="خیابان، پلاک، ..." />
            {state?.errors?.address && <p className={errorClass}>{state.errors.address}</p>}
          </div>

          <div>
            <label className={labelClass}>لوکیشن مغازه روی نقشه (اختیاری)</label>
            <LocationPicker lat={lat} lng={lng} onChange={(la, lo) => { setLat(la); setLng(lo); }} />
            <input type="hidden" name="lat" value={lat ?? ''} />
            <input type="hidden" name="lng" value={lng ?? ''} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {pending ? 'در حال ثبت...' : 'ثبت و ادامه'}
          </button>
        </form>
      </div>
    </main>
  );
}
