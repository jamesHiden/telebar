import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata = {
  title: "تله‌بار | پخش عمده‌ی میوه و تره‌بار، مستقیم از میدان مرکزی",
  description:
    "تأمین تخصصی میوه و تره‌بار برای فست‌فودها، پروتئینی‌ها، آبمیوه‌بستنی‌فروشی‌ها، رستوران‌ها و قنادی‌ها — سفارش امشب، تحویل فردا صبح درب مغازه.",
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
