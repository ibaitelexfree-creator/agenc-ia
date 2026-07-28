import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin-guard'
import PostForm from '../../post-form'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  await requireAdmin(locale)

  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, titulo_es, titulo_eu, contenido_es, contenido_eu, published, image_url')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-black">
        Editar entrada
      </h1>
      <PostForm locale={locale} mode="edit" postId={post.id} initialData={post} />
    </div>
  )
}
