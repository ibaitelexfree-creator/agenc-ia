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
