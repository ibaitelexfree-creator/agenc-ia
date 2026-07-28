'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin-guard'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const supabase = await createClient()
  const root = slugify(base) || 'post'
  let slug = root
  let suffix = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from('blog_posts').select('id').eq('slug', slug)
    if (ignoreId) query = query.neq('id', ignoreId)
    const { data } = await query.maybeSingle()
    if (!data) return slug
    suffix += 1
    slug = `${root}-${suffix}`
  }
}

async function uploadImageIfPresent(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('image') as File | null

  if (!file || file.size === 0) return null

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato de imagen no permitido. Usa PNG, JPG o WEBP.')
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('La imagen supera el tamaño máximo de 5MB.')
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `posts/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error(`Error subiendo la imagen: ${error.message}`)

  const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
  return data.publicUrl
}

export async function createPost(locale: string, formData: FormData) {
  const admin = await requireAdmin(locale)
  const supabase = await createClient()

  const titulo_es = String(formData.get('titulo_es') ?? '').trim()
  const titulo_eu = String(formData.get('titulo_eu') ?? '').trim() || null
  const contenido_es = String(formData.get('contenido_es') ?? '')
  const contenido_eu = String(formData.get('contenido_eu') ?? '') || null
  const published = formData.get('published') === 'on'

  if (!titulo_es) {
    throw new Error('El título en español es obligatorio')
  }

  const image_url = await uploadImageIfPresent(formData)
  const slug = await uniqueSlug(titulo_es)

  const { error } = await supabase.from('blog_posts').insert({
    slug,
    titulo_es,
    titulo_eu,
    contenido_es,
    contenido_eu,
    image_url,
    published,
    author_id: admin.id,
  })

  if (error) throw new Error(`No se pudo crear el post: ${error.message}`)

  revalidatePath(`/${locale}/admin/blog`)
  revalidatePath(`/${locale}/blog`)
  redirect(`/${locale}/admin/blog`)
}

export async function updatePost(locale: string, postId: string, formData: FormData) {
  await requireAdmin(locale)
  const supabase = await createClient()

  const titulo_es = String(formData.get('titulo_es') ?? '').trim()
  const titulo_eu = String(formData.get('titulo_eu') ?? '').trim() || null
  const contenido_es = String(formData.get('contenido_es') ?? '')
  const contenido_eu = String(formData.get('contenido_eu') ?? '') || null
  const published = formData.get('published') === 'on'

  if (!titulo_es) {
    throw new Error('El título en español es obligatorio')
  }

  const newImageUrl = await uploadImageIfPresent(formData)

  const updates: Record<string, unknown> = {
    titulo_es,
    titulo_eu,
    contenido_es,
    contenido_eu,
    published,
  }

  if (newImageUrl) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('image_url')
      .eq('id', postId)
      .single()

    updates.image_url = newImageUrl

    if (existing?.image_url) {
      const oldPath = existing.image_url.split('/blog-images/')[1]
      if (oldPath) {
        await supabase.storage.from('blog-images').remove([oldPath])
      }
    }
  }

  const { error } = await supabase.from('blog_posts').update(updates).eq('id', postId)

  if (error) throw new Error(`No se pudo actualizar el post: ${error.message}`)

  revalidatePath(`/${locale}/admin/blog`)
  revalidatePath(`/${locale}/blog`)
  redirect(`/${locale}/admin/blog`)
}

export async function deletePost(locale: string, postId: string) {
  await requireAdmin(locale)
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('image_url')
    .eq('id', postId)
    .single()

  const { error } = await supabase.from('blog_posts').delete().eq('id', postId)
  if (error) throw new Error(`No se pudo borrar el post: ${error.message}`)

  if (post?.image_url) {
    const path = post.image_url.split('/blog-images/')[1]
    if (path) {
      await supabase.storage.from('blog-images').remove([path])
    }
  }

  revalidatePath(`/${locale}/admin/blog`)
  revalidatePath(`/${locale}/blog`)
}
