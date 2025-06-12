import type { AppProps } from 'next/app'
import { Cairo, Tajawal } from "next/font/google"
import '../app/globals.css'

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
})

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${cairo.variable} ${tajawal.variable} font-arabic antialiased bg-gray-50`}>
      <Component {...pageProps} />
    </div>
  )
}
