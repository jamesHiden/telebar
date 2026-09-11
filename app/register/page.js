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

const STEP_FOR_FIELD = {
  phone: 1,
  password: 1,
  name: 2,
  shopName: 2,
  businessType: 2,
  address: 3,
};

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [step, setStep] = useState(1);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('');

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    const firstErrorField = Object.keys(state?.errors || {})[0];
    if (firstErrorField && STEP_FOR_FIELD[firstErrorField]) {
      setStep(STEP_FOR_FIELD[firstErrorField]);
    }
  }

  const step1Ready = phone.trim().length >= 10 && password.length >= 6;
  const step2Ready = name.trim().length >= 2 && shopName.trim().length >= 2 && businessType;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-[var(--brand-dark)]">
            🌿 تله‌بار
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--brand-dark)]">ثبت‌نام کسب‌وکار</h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-1.5 rounded-full transition-all ${
                  n === step ? 'w-8 bg-[var(--accent)]' : n < step ? 'w-8 bg-[var(--brand)]' : 'w-8 bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>

        <form action={action} className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
          {/* مرحله ۱: شماره و رمز */}
          <div className={step === 1 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm text-[var(--muted)] mb-2">مرحله ۱ از ۳ — شماره‌ی ورود</p>
            <div>
              <label className={labelClass} htmlFor="phone">شماره موبایل</label>
              <input
                id="phone"
                name="phone"
                className={inputClass}
                placeholder="09131234567"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {state?.errors?.phone && <p className={errorClass}>{state.errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="password">رمز عبور</label>
              <input
                id="password"
                name="password"
                type="password"
                className={inputClass}
                placeholder="حداقل ۶ کاراکتر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {state?.errors?.password && <p className={errorClass}>{state.errors.password}</p>}
            </div>
            <button
              type="button"
              disabled={!step1Ready}
              onClick={() => setStep(2)}
              className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              بعدی
            </button>
          </div>

          {/* مرحله ۲: مشخصات کسب‌وکار */}
          <div className={step === 2 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm text-[var(--muted)] mb-2">مرحله ۲ از ۳ — مشخصات کسب‌وکار</p>
            <div>
              <label className={labelClass} htmlFor="name">نام و نام‌خانوادگی</label>
              <input
                id="name"
                name="name"
                className={inputClass}
                placeholder="مثلاً علی رضایی"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {state?.errors?.name && <p className={errorClass}>{state.errors.name}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="shopName">نام مغازه / کسب‌وکار</label>
              <input
                id="shopName"
                name="shopName"
                className={inputClass}
                placeholder="مثلاً ساندویچ رضایی"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
              {state?.errors?.shopName && <p className={errorClass}>{state.errors.shopName}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="businessType">نوع کسب‌وکار</label>
              <select
                id="businessType"
                name="businessType"
                className={inputClass}
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="" disabled>انتخاب کنید</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                ))}
              </select>
              {state?.errors?.businessType && <p className={errorClass}>{state.errors.businessType}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-[var(--border)] py-3 rounded-lg font-medium hover:bg-[var(--brand-light)] transition"
              >
                قبلی
              </button>
              <button
                type="button"
                disabled={!step2Ready}
                onClick={() => setStep(3)}
                className="flex-1 bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-40"
              >
                بعدی
              </button>
            </div>
          </div>

          {/* مرحله ۳: آدرس و لوکیشن */}
          <div className={step === 3 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm text-[var(--muted)] mb-2">مرحله ۳ از ۳ — آدرس تحویل</p>
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
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-[var(--border)] py-3 rounded-lg font-medium hover:bg-[var(--brand-light)] transition"
              >
                قبلی
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {pending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--muted)]">
            قبلاً ثبت‌نام کردید؟{' '}
            <Link href="/login" className="text-[var(--brand)] font-medium">وارد شوید</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
