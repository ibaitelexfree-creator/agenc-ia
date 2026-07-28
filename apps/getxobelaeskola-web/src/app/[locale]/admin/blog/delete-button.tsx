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
      className="text-red-600 hover:underline disabled:opacity-50 text-sm font-medium"
    >
      {isPending ? 'Borrando…' : 'Borrar'}
    </button>
  )
}
