import Link from 'next/link';
import { getOptionalCustomer } from '@/lib/dal';
import { CATEGORIES } from '@/lib/constants';
import LogoutButton from '@/components/LogoutButton';

export default async function SiteHeader() {
  const customer = await getOptionalCustomer();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">
        <Link href="/" className="text-lg sm:text-xl font-bold text-[var(--brand-dark)] shrink-0">
          🌿 تله‌بار
        </Link>

        <form action="/search" method="GET" className="w-32 sm:w-48 md:w-64">
          <div className="relative">
            <input
              type="text"
              name="q"
              placeholder="جست‌وجوی محصول..."
              className="w-full rounded-lg border border-[var(--border)] bg-white pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm">🔍</span>
          </div>
        </form>

        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
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

        <div className="flex-1" />

        {customer ? (
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={customer.is_admin ? '/admin' : '/dashboard'}
              className="text-sm font-medium text-[var(--brand-dark)] hover:underline whitespace-nowrap"
            >
              سلام، {customer.name || customer.phone} 👋
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/login"
              className="text-sm sm:text-base bg-[var(--accent)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition whitespace-nowrap"
            >
              ورود / ثبت‌نام
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
