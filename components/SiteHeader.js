import Link from 'next/link';
import { getOptionalCustomer } from '@/lib/dal';
import { CATEGORIES } from '@/lib/constants';
import LogoutButton from '@/components/LogoutButton';

export default async function SiteHeader() {
  const customer = await getOptionalCustomer();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg sm:text-xl font-bold text-[var(--brand-dark)] shrink-0">
          🌿 تله‌بار
        </Link>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/category/${c.value}`}
              className="text-sm text-[var(--foreground)] hover:text-[var(--brand)] px-3 py-2 whitespace-nowrap"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {customer ? (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={customer.is_admin ? '/admin' : '/dashboard'}
              className="text-sm font-medium text-[var(--brand-dark)] hover:underline"
            >
              سلام، {customer.name} 👋
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/login" className="text-sm sm:text-base text-[var(--foreground)] hover:text-[var(--brand)] px-2 py-2">
              ورود
            </Link>
            <Link
              href="/register"
              className="text-sm sm:text-base bg-[var(--accent)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              ثبت‌نام
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
