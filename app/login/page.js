'use client';

import { Suspense, useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { requestOtp, verifyOtpAndLogin, passwordLogin } from '@/app/actions/auth';

const inputClass =
  'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] bg-white';
const labelClass = 'block text-sm font-medium mb-1 text-[var(--foreground)]';
const errorClass = 'text-sm text-red-600 mt-1';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const [requestState, requestAction, requestPending] = useActionState(requestOtp, undefined);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyOtpAndLogin, undefined);
  const [passwordState, passwordAction, passwordPending] = useActionState(passwordLogin, undefined);

  const [mode, setMode] = useState('phone');
  const [phone, setPhone] = useState('');

  const [seenRequestState, setSeenRequestState] = useState(requestState);
  if (requestState !== seenRequestState) {
    setSeenRequestState(requestState);
    if (requestState?.step) {
      setMode(requestState.step);
      if (requestState.phone) setPhone(requestState.phone);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-[var(--brand-dark)]">
            🌿 تله‌بار
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--brand-dark)]">ورود / ثبت‌نام</h1>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
          {mode === 'phone' && (
            <form action={requestAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label className={labelClass} htmlFor="phone">شماره موبایل</label>
                <input
                  id="phone"
                  name="phone"
                  className={inputClass}
                  placeholder="09131234567"
                  dir="ltr"
                  defaultValue={phone}
                  autoFocus
                />
                {requestState?.errors?.phone && <p className={errorClass}>{requestState.errors.phone}</p>}
              </div>
              <p className="text-xs text-[var(--muted)]">
                یه کد تأیید پیامکی براتون ارسال می‌کنیم. اگه قبلاً ثبت‌نام نکرده باشید، حساب‌تون همین‌جا ساخته میشه.
              </p>
              <button
                type="submit"
                disabled={requestPending}
                className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {requestPending ? 'در حال ارسال...' : 'ارسال کد ورود'}
              </button>
            </form>
          )}

          {mode === 'otp' && (
            <form action={verifyAction} className="space-y-4">
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="next" value={next} />
              <p className="text-sm text-[var(--muted)]">
                کد تأیید برای <span dir="ltr" className="font-medium text-[var(--foreground)]">{phone}</span> ارسال شد.
              </p>
              <div>
                <label className={labelClass} htmlFor="code">کد تأیید</label>
                <input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  className={`${inputClass} text-center tracking-[0.5em]`}
                  placeholder="•••••"
                  dir="ltr"
                  maxLength={5}
                  autoFocus
                />
                {verifyState?.errors?.code && <p className={errorClass}>{verifyState.errors.code}</p>}
              </div>
              <button
                type="submit"
                disabled={verifyPending}
                className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {verifyPending ? 'در حال بررسی...' : 'تأیید و ورود'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setMode('phone')} className="text-[var(--muted)] hover:underline">
                  تغییر شماره
                </button>
                <form action={requestAction}>
                  <input type="hidden" name="phone" value={phone} />
                  <input type="hidden" name="next" value={next} />
                  <button type="submit" className="text-[var(--brand)] font-medium hover:underline">
                    ارسال دوباره‌ی کد
                  </button>
                </form>
              </div>
              {requestState?.notice && <p className="text-xs text-[var(--muted)]">{requestState.notice}</p>}
            </form>
          )}

          {mode === 'password' && (
            <form action={passwordAction} className="space-y-4">
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="next" value={next} />
              <p className="text-sm text-[var(--muted)]">
                ورود ادمین برای <span dir="ltr" className="font-medium text-[var(--foreground)]">{phone}</span>
              </p>
              <div>
                <label className={labelClass} htmlFor="password">رمز عبور</label>
                <input id="password" name="password" type="password" className={inputClass} autoFocus />
                {passwordState?.errors?.password && <p className={errorClass}>{passwordState.errors.password}</p>}
              </div>
              <button
                type="submit"
                disabled={passwordPending}
                className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {passwordPending ? 'در حال ورود...' : 'ورود'}
              </button>
              <button type="button" onClick={() => setMode('phone')} className="text-sm text-[var(--muted)] hover:underline">
                تغییر شماره
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
