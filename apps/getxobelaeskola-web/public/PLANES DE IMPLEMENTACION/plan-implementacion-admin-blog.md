# Plan de implementación — Panel Admin Blog

Contexto: ya existen `actions.ts`, `admin/layout.tsx`, `admin/page.tsx` y `admin/blog/page.tsx`.
Este plan completa lo que falta y aplica 3 parches de seguridad sobre lo ya generado.
No hay decisiones abiertas: todo lo de abajo se ejecuta tal cual, en orden.

**Antes de empezar:** confirma en `supabase/schema.sql` que la tabla `profiles` tiene `id uuid` igual al `id` de `auth.users` (patrón estándar de Supabase). Si el nombre de columna es otro (p. ej. `user_id`), ajusta `admin-guard.ts` y las políticas SQL de la Fase 1 antes de ejecutarlas.

---

## Fase 1 — Base de datos (ejecutar en el SQL Editor de Supabase)

```sql
-- Tabla de posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  titulo_es text not null,
  titulo_eu text,
  contenido_es text not null default '',
  contenido_eu text,
  image_url text,
  published boolean not null default false,
  author_id uuid references auth.users(id) on delete set null
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, created_at desc);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

create policy "blog_posts_public_read" on public.blog_posts
  for select
  using (published = true);

create policy "blog_posts_admin_read_all" on public.blog_posts
  for select
  using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin')
  );

create policy "blog_posts_admin_insert" on public.blog_posts
  for insert
  with check (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin')
  );

create policy "blog_posts_admin_update" on public.blog_posts
  for update
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin'))
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin'));

create policy "blog_posts_admin_delete" on public.blog_posts
  for delete
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin'));

-- Bucket de imágenes (público en lectura)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "blog_images_public_read" on storage.objects
  for select
  using (bucket_id = 'blog-images');

create policy "blog_images_admin_write" on storage.objects
  for insert
  with check (
    bucket_id = 'blog-images'
    and exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin')
  );

create policy "blog_images_admin_update" on storage.objects
  for update
  using (
    bucket_id = 'blog-images'
    and exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.rol = 'admin')
  );

-- 5. Seed Data (Cargar los 3 artículos iniciales si no existen)
insert into public.blog_posts (slug, titulo_es, titulo_eu, contenido_es, contenido_eu, image_url, published)
values 
(
  'como-leer-una-carta-nautica-en-5-pasos',
  'Cómo leer una carta náutica en 5 pasos',
  'Nola irakurri itsas karta bat 5 urratsetan',
  'Las cartas náuticas son el mapa de carreteras del marino. En esta guía práctica te enseñamos a interpretar la escala de latitudes y longitudes, a leer los números de sonda que indican el relieve submarino, a reconocer la simbología oficial de faros, boyas e instalaciones portuarias, y a trazar rumbos verdaderos corregidos con la declinación magnética para una travesía 100% segura.',
  'Itsas kartak itsasoan zehar nabigatzeko ezinbesteko tresnak dira. Pauso hauetan ikasiko duzu koordenatuak identifikatzen, sakonera neurtzen duten sondak irakurtzen, ikurrak eta itsasargien argi-karakteristikak ezagutzen, eta segurtasunez portura iristeko bideak marrazten.',
  '/images/home-hero-sailing-action.webp',
  true
),
(
  'tacticas-de-regata-domina-las-salidas-con-viento-fuerte',
  'Tácticas de regata: Domina las salidas con viento fuerte',
  'Estropada taktikak: Irteerak haize indartsuarekin dominatu',
  'La línea de salida es donde se ganan y pierden la mayoría de las regatas, especialmente cuando el anemómetro sube de los 20 nudos. En este artículo detallamos la técnica para mantener el barco en stand-by (parado con control), la forma óptima de cazar velas para arrancar en el último segundo y cómo distribuir el peso de la tripulación en la banda para mantener el barco plano.',
  'Haize indartsuarekin estropada baten irteera kontrolatzea funtsezkoa da. Zure J80 ontziaren bela-trimatzea doitzen ikasiko dugu, baita taldekide bakoitzaren pisua banatzen ere, irteerako momentuan abiadura maximoa lortzeko.',
  '/images/course-detail-header-sailing.webp',
  true
),
(
  'los-mejores-rincones-para-fondear-en-el-abra-de-getxo',
  'Los mejores rincones para fondear en el Abra de Getxo',
  'Getxoko Abrako ainguratzeko txokorik onenak',
  'Fondease en el Abra de Getxo es una experiencia maravillosa si sabes dónde hacerlo. Te revelamos las mejores coordenadas al resguardo del viento de componente Norte y Noroeste, los detalles sobre el fondo de arena para asegurar el agarre del ancla (tenedero), y las precauciones necesarias según la carrera de marea de ese día.',
  'Getxoko Abra inguruan kala zoragarriak eta hondartza babestuak daude ainguratzeko. Marea-taulak egiaztatzea gomendatzen da, baita hondar-motak aztertzea ere aingura ondo finka dadin.',
  '/images/course-raquero-students.webp',
  true
)
on conflict (slug) do nothing;
```

---

## Fase 2 — Guard de autenticación

**Crear:** `src/lib/auth/admin-guard.ts`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin(locale: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/auth/login?redirect=/${locale}/admin`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, rol')
    .eq('id', user.id)
    .single()

  if (!profile || profile.rol !== 'admin') {
    redirect(`/${locale}`)
  }

  return { id: user.id, rol: profile.rol }
}
```

---

## Fase 3 — Parchear las Server Actions ya generadas

**Reemplazar el contenido completo de** `src/app/[locale]/admin/blog/actions.ts` **por este** (añade validación de imagen y borrado de la imagen antigua al reemplazarla; el resto queda igual que la versión original):

```typescript
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
```

---

## Fase 4 — Botón de borrar

**Crear:** `src/app/[locale]/admin/blog/delete-button.tsx`

```tsx
'use client'

import { useTransition } from 'react'
import { deletePost } from './actions'

export default function DeleteButton({
  locale,
  postId,
}: {
  locale: string
  postId: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('¿Seguro que quieres borrar esta entrada? Esta acción no se puede deshacer.')) {
      return
    }
    startTransition(() => {
      deletePost(locale, postId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? 'Borrando…' : 'Borrar'}
    </button>
  )
}
```

**Editar** `src/app/[locale]/admin/blog/page.tsx` (el listado ya generado) — el `deletePost` necesita el `locale`, que hoy no se pasa. Cambiar esta línea:

```diff
- <DeleteButton postId={post.id} />
+ <DeleteButton locale={locale} postId={post.id} />
```

---

## Fase 5 — Formulario compartido (crear y editar)

**Crear:** `src/app/[locale]/admin/blog/post-form.tsx`

```tsx
'use client'

import { useState, useTransition } from 'react'
import { createPost, updatePost } from './actions'

type PostFormProps = {
  locale: string
  mode: 'create' | 'edit'
  postId?: string
  initialData?: {
    titulo_es: string
    titulo_eu: string | null
    contenido_es: string
    contenido_eu: string | null
    published: boolean
    image_url: string | null
  }
}

export default function PostForm({ locale, mode, postId, initialData }: PostFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createPost(locale, formData)
        } else if (postId) {
          await updatePost(locale, postId, formData)
        }
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          throw err // dejar que Next.js gestione la redirección tras guardar bien
        }
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    })
  }

  return (
    <form action={handleSubmit} encType="multipart/form-data" className="max-w-2xl space-y-6">
      {error && (
        <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-black">
          Título (Español) *
        </label>
        <input
          type="text"
          name="titulo_es"
          required
          defaultValue={initialData?.titulo_es}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-black">
          Título (Euskera)
        </label>
        <input
          type="text"
          name="titulo_eu"
          defaultValue={initialData?.titulo_eu ?? ''}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-black">
          Contenido (Español, Markdown) *
        </label>
        <textarea
          name="contenido_es"
          required
          rows={10}
          defaultValue={initialData?.contenido_es}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-black">
          Contenido (Euskera, Markdown)
        </label>
        <textarea
          name="contenido_eu"
          rows={10}
          defaultValue={initialData?.contenido_eu ?? ''}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-blue focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-black">
          Imagen {mode === 'edit' && '(deja vacío para mantener la actual)'}
        </label>
        {initialData?.image_url && (
          <img
            src={initialData.image_url}
            alt=""
            className="mb-2 h-24 w-24 rounded object-cover"
          />
        )}
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          className="block w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={initialData?.published}
          className="h-4 w-4"
        />
        <label htmlFor="published" className="text-sm text-brand-black">
          Publicar (visible en la web)
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Guardando…' : mode === 'create' ? 'Crear entrada' : 'Guardar cambios'}
      </button>
    </form>
  )
}
```

---

## Fase 6 — Página "Nueva entrada"

**Crear:** `src/app/[locale]/admin/blog/new/page.tsx`

```tsx
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
```

---

## Fase 7 — Página "Editar entrada"

**Crear:** `src/app/[locale]/admin/blog/[id]/edit/page.tsx`

```tsx
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
```

---

## Fase 8 — Conectar el blog público a Supabase

No tengo el archivo real de `src/app/[locale]/blog/page.tsx`, así que esto es una plantilla — adapta los nombres de campos y el diseño de tarjetas al que ya tenga tu página de blog actual, solo cambia la fuente de datos:

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, titulo_es, titulo_eu, image_url, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const getTitulo = (post: { titulo_es: string; titulo_eu: string | null }) =>
    locale === 'eu' ? post.titulo_eu ?? post.titulo_es : post.titulo_es

  return (
    <div>
      {/* Renderizar posts?.map(...) usando getTitulo(post), post.image_url, post.slug */}
    </div>
  )
}
```

Si ya existe una página de detalle tipo `blog/[slug]/page.tsx`, hay que hacer lo mismo: fetch a `blog_posts` filtrando por `slug` y `published = true`, seleccionando también `contenido_es` / `contenido_eu`, y renderizando el markdown con `react-markdown` (ya está en el proyecto).

---

## Fase 9 — Verificación final y capturas para el Kit Digital

1. Crear un usuario de prueba con `rol = 'admin'` en `profiles` y comprobar que:
   - Un usuario sin rol admin es redirigido al intentar entrar a `/admin`.
   - El admin puede crear, editar y borrar un post, con y sin imagen.
   - Al reemplazar una imagen en "Editar", la antigua desaparece del bucket `blog-images` (Storage → verificar en el dashboard de Supabase).
   - Subir un archivo no-imagen o de más de 5MB da el error esperado sin romper la página.
2. Publicar un post de prueba y confirmar que aparece en `/blog` (público, sin sesión).
3. Capturas para el Kit Digital:
   - Panel de listado (`/admin/blog`) con la URL del dominio visible en la barra del navegador.
   - Formulario de edición (`/admin/blog/[id]/edit`) mostrando el campo de texto y el input de imagen.

---

## Decisiones ya cerradas (no reabrir)

- Rol de admin vía `profiles.rol = 'admin'`
- Multi-idioma es/eu por columnas (`titulo_es`/`titulo_eu`, `contenido_es`/`contenido_eu`)
- Editor: textarea + Markdown (sin RTE)
- CRUD vía Server Actions (no API routes)
- Ruta del panel: `/admin`
