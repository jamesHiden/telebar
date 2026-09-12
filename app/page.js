import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_PRODUCTS, BUSINESS_TYPES, CUTOFF_HOUR } from '@/lib/constants';
import { getBulkProducts } from '@/lib/db';
import SiteHeader from '@/components/SiteHeader';
import Reveal from '@/components/Reveal';

const fmt = (n) => Number(n).toLocaleString('en-US');

const STEPS = [
  {
    n: '۱',
    title: 'با شماره‌تون وارد بشید',
    desc: 'فقط با یه کد پیامکی — بدون رمز عبور، بدون فرم طولانی.',
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
  { icon: '🚚', text: 'مستقیم از میدان میوه و تره‌بار مرکزی — بدون واسطه‌ی اضافه' },
];

const QUALITY_CHECKLIST = [
  'محصول درجه‌بندی‌شده',
  'بدون محصول خراب یا له‌شده',
  'وزن دقیق',
  'بسته‌بندی تمیز',
  'امکان مرجوعی در صورت مغایرت',
];

const HERO_PHOTOS = [
  { src: '/products/gojeh.jpg', alt: 'گوجه‌فرنگی', className: 'top-0 right-6 w-28 sm:w-36 rotate-[-8deg] animate-float', z: 30 },
  { src: '/products/havij.png', alt: 'هویج', className: 'top-20 left-0 w-24 sm:w-32 rotate-[6deg] animate-float-slow', z: 20 },
  { src: '/products/bademjan.png', alt: 'بادمجان', className: 'bottom-6 right-16 w-24 sm:w-32 rotate-[10deg] animate-float-slow', z: 20 },
  { src: '/products/sib.png', alt: 'سیب قرمز', className: 'bottom-0 left-10 w-24 sm:w-28 rotate-[-6deg] animate-float', z: 10 },
];

export default async function HomePage() {
  const bulkProducts = await getBulkProducts();

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
              فعال در اصفهان — ارسال از میدان میوه و تره‌بار مرکزی
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[var(--brand-dark)]">
              پخش عمده‌ی میوه و تره‌بار،
              <br /> مستقیم از میدان مرکزی
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--muted)] leading-8 max-w-lg">
              تأمین تخصصی برای رستوران‌ها، هایپرمارکت‌ها، آبمیوه‌بستنی‌فروشی‌ها و قنادی‌ها — و عرضه
              به ارگان‌های دولتی و خصوصی. بدون واسطه، مستقیم از میدان میوه و تره‌بار مرکزی به مغازه‌ی شما.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-all"
              >
                همین حالا ثبت‌نام کنید
              </Link>
              <Link
                href="#chi-kareii"
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
          </div>
        </section>

        {/* چی کاره‌ای؟ */}
        <section id="chi-kareii" className="py-10 bg-[var(--brand-light)]/60 border-y border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-lg font-bold text-[var(--brand-dark)] mb-6">چی کاره‌ای؟</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {BUSINESS_TYPES.map((t) => (
                <Link
                  key={t.value}
                  href={`/category/${t.category}`}
                  className="group flex items-center gap-2 bg-white border border-[var(--border)] rounded-full pl-5 pr-4 py-3 hover:border-[var(--brand)] hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">{t.emoji}</span>
                  <span className="font-medium text-[var(--foreground)]">{t.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="border-b border-[var(--border)] bg-[var(--brand-light)]/30 py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...DEFAULT_PRODUCTS, ...DEFAULT_PRODUCTS].map((p, i) => (
              <span key={i} className="mx-4 text-sm text-[var(--brand-dark)] font-medium">
                {p.emoji} {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* قیمت امروز */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--brand-dark)]">
                قیمت امروز تله‌بار
              </h2>
              <p className="mt-2 text-center text-[var(--muted)]">
                قیمت‌ها هر روز صبح به‌روزرسانی می‌شوند.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-8 bg-white border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)] overflow-hidden">
                {bulkProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                    <span className="font-medium">
                      {p.emoji} {p.name}
                    </span>
                    <span className="text-[var(--brand-dark)] font-bold">
                      {fmt(p.price)} تومان{' '}
                      <span className="text-[var(--muted)] font-normal text-sm">/ {p.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/category/all" className="text-[var(--accent)] font-medium hover:underline">
                  دیدن همه‌ی محصولات و قیمت‌ها ←
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* تحویل صبح */}
        <section className="py-16 bg-[var(--brand-dark)]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  ⏰ سفارش امشب ← تحویل فردا صبح
                </h2>
                <p className="mt-4 text-white/80 text-base sm:text-lg">
                  تا ساعت {CUTOFF_HOUR}:۰۰ سفارش بدید، قبل از باز شدن مغازه، جنس تحویل بگیرید.
                </p>
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
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {WHY_US.map((w, i) => (
                <Reveal key={w.text} delay={i * 100}>
                  <div className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-xl p-4 h-full hover:shadow-md transition-shadow">
                    <span className="text-2xl shrink-0">{w.icon}</span>
                    <span className="text-[var(--foreground)] leading-7">{w.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div className="mt-6 bg-[var(--brand-light)] border border-[var(--brand)]/30 rounded-xl p-6">
                <h3 className="font-bold text-[var(--brand-dark)]">کیفیت تله‌بار یعنی:</h3>
                <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                  {QUALITY_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[var(--foreground)]">
                      <span className="text-[var(--brand)] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
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
                  href="/login"
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
          <span>🌿 تله‌بار — پخش عمده‌ی میوه و تره‌بار، مستقیم از میدان مرکزی</span>
          <span>مناطق تحت پوشش: اصفهان</span>
        </div>
      </footer>
    </>
  );
}
