import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Top Marketing - نظام إدارة الخدمات التسويقية",
  description: "نظام إداري متكامل لإدارة خدمات التسويق والتصميم والمونتاج وصفحات السوشيال ميديا",
  keywords: "تسويق, تصميم, مونتاج, سوشيال ميديا, عقارات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${tajawal.variable} font-arabic antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
