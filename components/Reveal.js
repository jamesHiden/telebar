'use client';

import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // اگه همون لحظه‌ی mount نسبتاً نزدیک دیده‌شدنه (تا ۲.۵ صفحه پایین‌تر)، منتظر observer نمون
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 2.5) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '400px 0px' }
    );
    observer.observe(el);

    // شبکه‌ی ایمنی: اگه به هر دلیلی observer فایر نشد (مثلاً ابزار اسکرین‌شات)، محتوا سریع نمایش داده بشه
    const fallback = setTimeout(() => setVisible(true), 300);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
