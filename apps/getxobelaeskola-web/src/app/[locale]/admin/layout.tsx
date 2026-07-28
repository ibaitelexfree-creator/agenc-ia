import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin-guard'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin(locale)

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <span className="rounded bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">
              Panel Admin
            </span>
            <nav className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href={`/${locale}/admin/blog`} className="hover:text-brand-blue">
                Blog / Noticias
              </Link>
            </nav>
          </div>
          <Link
            href={`/${locale}`}
            className="text-xs text-gray-500 hover:text-gray-900"
          >
            ← Volver a la web pública
          </Link>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}
