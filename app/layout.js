import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata = {
  title: "تله‌بار | تأمین سبزی و صیفی‌جات تازه برای کسب‌وکار شما",
  description:
    "تأمین روزانه‌ی سبزی و صیفی‌جات تازه برای ساندویچی‌ها، پروتئینی‌ها، آب‌میوه‌گیری‌ها و رستوران‌ها — سفارش آنلاین، تحویل صبحگاهی درب مغازه.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
