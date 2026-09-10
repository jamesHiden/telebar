import Link from 'next/link';
import { DEFAULT_PRODUCTS, BUSINESS_TYPES } from '@/lib/constants';

const AUDIENCE = [
  {
    emoji: '🥪',
    title: 'ساندویچی / پروتئینی',
    desc: 'کاهو، گوجه، خیار، پیاز، قارچ و سیب‌زمینی همیشه تازه — بدون نیاز به رفتن به میدون برای چند کیلو جنس.',
  },
  {
    emoji: '🥕',
    title: 'آب‌میوه و آب‌هویج‌گیری',
    desc: 'هویج، پرتقال، سیب و کرفس با کیفیت یکنواخت، هر روز صبح آماده‌ی گرفتن آب.',
  },
  {
    emoji: '🍽️',
    title: 'رستوران‌ها',
    desc: 'سبزی خوردن، سبزی معطر، پیاز، سیر و صیفی‌جات مورد نیاز آشپزخانه، تحویل قبل از باز شدن رستوران.',
  },
  {
    emoji: '🏪',
    title: 'سایر کسب‌وکارهای غذایی',
    desc: 'هر کسب‌وکاری که مصرف روزانه‌ی کم‌حجم داره ولی رفتن به میدون براش نمی‌صرفه.',
  },
];

const STEPS = [
  {
    n: '۱',
    title: 'ثبت‌نام کنید',
    desc: 'نام مغازه، نوع کسب‌وکار و آدرس دقیق‌تون رو وارد می‌کنید.',
  },
  {
    n: '۲',
    title: 'شب قبل سفارش بدید',
    desc: 'لیست قیمت همون روز رو می‌بینید و تا قبل از ساعت مشخص سفارش فردا رو ثبت می‌کنید.',
  },
  {
    n: '۳',
    title: 'صبح زود تحویل بگیرید',
    desc: 'سفارش‌تون رو صبح زود، قبل از باز شدن مغازه، درب محل تحویل می‌گیرید.',
  },
];

const WHY_US = [
  'صرفه‌جویی در وقت و نیروی کار — دیگه لازم نیست کسی صبح زود بره میدون',
  'قیمت شفاف و به‌روز — هر روز قیمت واقعی بازار رو آنلاین می‌بینید',
  'کیفیت یکنواخت — کالا از قبل انتخاب و دسته‌بندی شده',
  'حساب و کتاب ساده — امکان خرید نسیه و تسویه دوره‌ای',
];

export default function HomePage() {
  return (
    <>
      <header className="border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--brand-dark)]">🌿 تله‌بار</span>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="text-sm sm:text-base text-[var(--foreground)] hover:text-[var(--brand)] px-2 py-2">
              ورود
            </Link>
            <Link
              href="/register"
              className="text-sm sm:text-base bg-[var(--accent)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              ثبت‌نام
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[var(--brand-dark)]">
              سبزی و صیفی‌جات تازه،
              <br /> هر روز صبح دم مغازه‌تون
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--muted)] leading-8">
              دیگه لازم نیست برای دو تا سبد قارچ یا چند کیلو هویج تا میدون تره‌بار برید و وقت
              بذارید. شب قبل سفارش بدید، صبح زود تحویل بگیرید — با قیمت شفاف و کیفیت تضمینی.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                همین حالا ثبت‌نام کنید
              </Link>
              <Link
                href="#how-it-works"
                className="border border-[var(--border)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--brand-light)] transition"
              >
                چطور کار می‌کند؟
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--brand-light)] p-8 text-center">
            <p className="text-6xl">🥬🍅🥕🧄🍄</p>
            <p className="mt-4 text-[var(--brand-dark)] font-medium">
              فقط همون چیزی که کسب‌وکار غذایی شما هر روز لازم داره
            </p>
          </div>
        </section>

        {/* Audience */}
        <section className="bg-[var(--brand-light)]/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
              مخصوص کسب‌وکارهایی مثل شما
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCE.map((a) => (
                <div key={a.title} className="bg-white rounded-xl p-6 border border-[var(--border)] shadow-sm">
                  <div className="text-4xl">{a.emoji}</div>
                  <h3 className="mt-3 font-bold text-[var(--brand-dark)]">{a.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-6">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
              نمونه‌ای از محصولات هر روزه
            </h2>
            <p className="mt-2 text-center text-[var(--muted)]">
              لیست کامل و قیمت روز، بعد از ثبت‌نام در پنل سفارش قابل مشاهده‌ست.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {DEFAULT_PRODUCTS.map((p) => (
                <span
                  key={p.name}
                  className="bg-white border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--foreground)]"
                >
                  {p.emoji} {p.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-[var(--brand-light)]/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
              فقط سه قدم ساده
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-xl font-bold">
                    {s.n}
                  </div>
                  <h3 className="mt-4 font-bold text-[var(--brand-dark)]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)] leading-6">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
              چرا تله‌بار؟
            </h2>
            <ul className="mt-10 space-y-4">
              {WHY_US.map((w) => (
                <li key={w} className="flex items-start gap-3 text-[var(--foreground)]">
                  <span className="text-[var(--brand)] font-bold mt-0.5">✓</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center bg-[var(--brand-dark)] rounded-2xl py-14 px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">آماده‌اید شروع کنید؟</h2>
            <p className="mt-3 text-white/80">
              همین امروز ثبت‌نام کنید و فردا صبح اولین سفارش‌تون رو تحویل بگیرید.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block bg-[var(--accent)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              ثبت‌نام رایگان
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <span>🌿 تله‌بار — تأمین روزانه‌ی سبزی و صیفی‌جات برای کسب‌وکارهای غذایی</span>
          <span>مناطق تحت پوشش: اصفهان</span>
        </div>
      </footer>
    </>
  );
}
