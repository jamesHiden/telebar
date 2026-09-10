import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_PRODUCTS } from '@/lib/constants';
import SiteHeader from '@/components/SiteHeader';
import Reveal from '@/components/Reveal';

const AUDIENCE = [
  {
    emoji: '🥪',
    title: 'ساندویچی / پروتئینی',
    category: 'sandwich',
    desc: 'کاهو، گوجه، خیار، پیاز، قارچ و سیب‌زمینی همیشه تازه — بدون نیاز به رفتن به میدون برای چند کیلو جنس.',
  },
  {
    emoji: '🥕',
    title: 'آب‌میوه و آب‌هویج‌گیری',
    category: 'juice',
    desc: 'هویج، پرتقال، سیب و کرفس با کیفیت یکنواخت، هر روز صبح آماده‌ی گرفتن آب.',
  },
  {
    emoji: '🍽️',
    title: 'رستوران‌ها',
    category: 'restaurant',
    desc: 'سبزی خوردن، سبزی معطر، پیاز، سیر و صیفی‌جات مورد نیاز آشپزخانه، تحویل قبل از باز شدن رستوران.',
  },
  {
    emoji: '🏪',
    title: 'سایر کسب‌وکارهای غذایی',
    category: 'all',
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
  { icon: '⏱️', text: 'صرفه‌جویی در وقت و نیروی کار — دیگه لازم نیست کسی صبح زود بره میدون' },
  { icon: '💳', text: 'قیمت شفاف و به‌روز — هر روز قیمت واقعی بازار رو آنلاین می‌بینید' },
  { icon: '✅', text: 'کیفیت یکنواخت — کالا از قبل انتخاب و دسته‌بندی شده' },
  { icon: '📒', text: 'حساب و کتاب ساده — امکان خرید نسیه و تسویه دوره‌ای' },
];

const HERO_PHOTOS = [
  { src: '/products/gojeh.jpg', alt: 'گوجه‌فرنگی', className: 'top-0 right-6 w-28 sm:w-36 rotate-[-8deg] animate-float', z: 30 },
  { src: '/products/havij.jpg', alt: 'هویج', className: 'top-20 left-0 w-24 sm:w-32 rotate-[6deg] animate-float-slow', z: 20 },
  { src: '/products/bademjan.jpg', alt: 'بادمجان', className: 'bottom-6 right-16 w-24 sm:w-32 rotate-[10deg] animate-float-slow', z: 20 },
  { src: '/products/sib.jpg', alt: 'سیب قرمز', className: 'bottom-0 left-10 w-24 sm:w-28 rotate-[-6deg] animate-float', z: 10 },
];

export default async function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28 grid gap-10 md:grid-cols-2 items-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--brand-light)] blur-3xl opacity-70 animate-blob"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-40 -left-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl opacity-70 animate-blob"
            style={{ animationDelay: '3s' }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-light)] text-[var(--brand-dark)] text-xs font-medium px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]" />
              </span>
              فعال در اصفهان — همین حالا سفارش بگیرید
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[var(--brand-dark)]">
              سبزی و صیفی‌جات تازه،
              <br /> هر روز صبح دم مغازه‌تون
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--muted)] leading-8 max-w-lg">
              دیگه لازم نیست برای دو تا سبد قارچ یا چند کیلو هویج تا میدون تره‌بار برید و وقت
              بذارید. شب قبل سفارش بدید، صبح زود تحویل بگیرید — با قیمت شفاف و کیفیت تضمینی.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-all"
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

          <div className="relative h-72 sm:h-96">
            {HERO_PHOTOS.map((p) => (
              <div
                key={p.src}
                className={`absolute ${p.className} aspect-square rounded-2xl overflow-hidden shadow-xl ring-4 ring-white bg-white`}
                style={{ zIndex: p.z }}
              >
                <Image src={p.src} alt={p.alt} fill sizes="200px" className="object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[var(--brand)] text-white flex flex-col items-center justify-center shadow-2xl">
                <span className="text-2xl sm:text-3xl font-extrabold">۲۲+</span>
                <span className="text-[10px] sm:text-xs">محصول تازه</span>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="border-y border-[var(--border)] bg-[var(--brand-light)]/50 py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...DEFAULT_PRODUCTS, ...DEFAULT_PRODUCTS].map((p, i) => (
              <span key={i} className="mx-4 text-sm text-[var(--brand-dark)] font-medium">
                {p.emoji} {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* Audience */}
        <section className="bg-[var(--brand-light)]/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
                مخصوص کسب‌وکارهایی مثل شما
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AUDIENCE.map((a, i) => (
                <Reveal key={a.title} delay={i * 100}>
                  <Link
                    href={`/category/${a.category}`}
                    className="group bg-white rounded-xl p-6 border border-[var(--border)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block h-full"
                  >
                    <div className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      {a.emoji}
                    </div>
                    <h3 className="mt-3 font-bold text-[var(--brand-dark)]">{a.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)] leading-6">{a.desc}</p>
                    <p className="mt-3 text-sm text-[var(--accent)] font-medium">
                      دیدن محصولات و قیمت{' '}
                      <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
                نمونه‌ای از محصولات هر روزه
              </h2>
              <p className="mt-2 text-center text-[var(--muted)]">
                قیمت‌ها برای همه قابل مشاهده‌ست — نیازی به ثبت‌نام برای دیدن‌شون نیست.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {DEFAULT_PRODUCTS.map((p) => (
                  <Link
                    key={p.name}
                    href={`/category/${p.category}`}
                    className="bg-white border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--foreground)] hover:border-[var(--brand)] hover:-translate-y-0.5 hover:shadow-sm transition-all"
                  >
                    {p.emoji} {p.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-[var(--brand-light)]/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
                فقط سه قدم ساده
              </h2>
            </Reveal>
            <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
              <div className="hidden sm:block absolute top-6 left-[16.5%] right-[16.5%] h-0.5 bg-[var(--brand)]/30" />
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 150}>
                  <div className="relative text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-[var(--brand)]/30">
                      {s.n}
                    </div>
                    <h3 className="mt-4 font-bold text-[var(--brand-dark)]">{s.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)] leading-6">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
                چرا تله‌بار؟
              </h2>
            </Reveal>
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {WHY_US.map((w, i) => (
                <Reveal key={w.text} delay={i * 100}>
                  <div className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-xl p-4 h-full hover:shadow-md transition-shadow">
                    <span className="text-2xl shrink-0">{w.icon}</span>
                    <span className="text-[var(--foreground)] leading-7">{w.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <div className="relative text-center bg-[var(--brand-dark)] rounded-2xl py-14 px-6 overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 animate-blob"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[var(--accent)]/10 animate-blob"
                  style={{ animationDelay: '2s' }}
                />
                <h2 className="relative text-2xl sm:text-3xl font-bold text-white">آماده‌اید شروع کنید؟</h2>
                <p className="relative mt-3 text-white/80">
                  همین امروز ثبت‌نام کنید و فردا صبح اولین سفارش‌تون رو تحویل بگیرید.
                </p>
                <Link
                  href="/register"
                  className="relative mt-6 inline-block bg-[var(--accent)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-all"
                >
                  ثبت‌نام رایگان
                </Link>
              </div>
            </Reveal>
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
