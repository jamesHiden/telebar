'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { signup } from '@/app/actions/auth';
import { BUSINESS_TYPES } from '@/lib/constants';
import LocationPicker from '@/components/LocationPicker';

const inputClass =
  'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] bg-white';
const labelClass = 'block text-sm font-medium mb-1 text-[var(--foreground)]';
const errorClass = 'text-sm text-red-600 mt-1';

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-[var(--brand-dark)]">
            🌿 سبزی روز
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--brand-dark)]">ثبت‌نام کسب‌وکار</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">برای شروع سفارش‌گیری روزانه، اطلاعات زیر رو تکمیل کنید</p>
        </div>

        <form action={action} className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
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
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {state?.errors?.businessType && <p className={errorClass}>{state.errors.businessType}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="phone">شماره موبایل</label>
            <input id="phone" name="phone" className={inputClass} placeholder="09131234567" dir="ltr" />
            {state?.errors?.phone && <p className={errorClass}>{state.errors.phone}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="password">رمز عبور</label>
            <input id="password" name="password" type="password" className={inputClass} placeholder="حداقل ۶ کاراکتر" />
            {state?.errors?.password && <p className={errorClass}>{state.errors.password}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="address">آدرس مغازه</label>
            <textarea id="address" name="address" rows={2} className={inputClass} placeholder="خیابان، پلاک، ..." />
            {state?.errors?.address && <p className={errorClass}>{state.errors.address}</p>}
          </div>

          <div>
            <label className={labelClass}>لوکیشن مغازه روی نقشه</label>
            <LocationPicker lat={lat} lng={lng} onChange={(la, lo) => { setLat(la); setLng(lo); }} />
            <input type="hidden" name="lat" value={lat ?? ''} />
            <input type="hidden" name="lng" value={lng ?? ''} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {pending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>

          <p className="text-center text-sm text-[var(--muted)]">
            قبلاً ثبت‌نام کردید؟{' '}
            <Link href="/login" className="text-[var(--brand)] font-medium">وارد شوید</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
