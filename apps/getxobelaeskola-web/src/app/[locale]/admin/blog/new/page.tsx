import { requireAdmin } from '@/lib/auth/admin-guard'
import PostForm from '../post-form'

export default async function NewPostPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin(locale)

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-black">
        Nueva entrada
      </h1>
      <PostForm locale={locale} mode="create" />
    </div>
  )
}
