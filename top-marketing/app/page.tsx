import { redirect } from 'next/navigation'

export default function RootPage() {
  // إعادة توجيه إلى الصفحة الرئيسية العامة
  redirect('/home')
}
