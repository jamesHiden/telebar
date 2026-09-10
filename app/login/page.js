'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { login } from '@/app/actions/auth';

const inputClass =
  'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] bg-white';
const labelClass = 'block text-sm font-medium mb-1 text-[var(--foreground)]';
const errorClass = 'text-sm text-red-600 mt-1';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-[var(--brand-dark)]">
            🌿 سبزی روز
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-[var(--brand-dark)]">ورود</h1>
        </div>

        <form action={action} className="bg-white border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="phone">شماره موبایل</label>
            <input id="phone" name="phone" className={inputClass} placeholder="09131234567" dir="ltr" />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">رمز عبور</label>
            <input id="password" name="password" type="password" className={inputClass} />
          </div>

          {state?.errors?.phone && <p className={errorClass}>{state.errors.phone}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--accent)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {pending ? 'در حال ورود...' : 'ورود'}
          </button>

          <p className="text-center text-sm text-[var(--muted)]">
            هنوز ثبت‌نام نکردید؟{' '}
            <Link href="/register" className="text-[var(--brand)] font-medium">ثبت‌نام کنید</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
