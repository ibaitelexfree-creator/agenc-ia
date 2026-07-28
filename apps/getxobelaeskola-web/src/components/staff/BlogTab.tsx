'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createPost, updatePost, deletePost } from '@/app/[locale]/admin/blog/actions';

interface BlogPost {
  id: string;
  slug: string;
  titulo_es: string;
  titulo_eu: string | null;
  contenido_es: string;
  contenido_eu: string | null;
  published: boolean;
  image_url: string | null;
  created_at: string;
}

export default function BlogTab({ locale }: { locale: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (postId: string) => {
    if (!confirm('¿Seguro que quieres borrar esta entrada del blog?')) return;
    startTransition(async () => {
      try {
        await deletePost(locale, postId);
        await fetchPosts();
      } catch (err: any) {
        alert(err?.message || 'Error al borrar la entrada');
      }
    });
  };

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        if (view === 'create') {
          await createPost(locale, formData);
        } else if (view === 'edit' && editingPost) {
          await updatePost(locale, editingPost.id, formData);
        }
        await fetchPosts();
        setView('list');
        setEditingPost(null);
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          await fetchPosts();
          setView('list');
          setEditingPost(null);
          return;
        }
        setError(err instanceof Error ? err.message : 'Error al guardar');
      }
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center glass-panel border border-white/10 rounded-sm">
        <div className="w-10 h-10 border-t-2 border-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-3xs uppercase tracking-widest text-accent font-bold">Cargando noticias y blog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-premium-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-sm">
        <div>
          <span className="text-accent uppercase tracking-[0.3em] text-3xs font-black block mb-1">
            Gestión Autogestionable de Contenidos
          </span>
          <h2 className="text-2xl font-display text-white italic">Bitácora & Noticias</h2>
        </div>

        {view === 'list' ? (
          <button
            onClick={() => {
              setEditingPost(null);
              setError(null);
              setView('create');
            }}
            className="px-6 py-3 bg-accent text-nautical-black text-3xs uppercase font-black tracking-widest hover:bg-white transition-all shadow-lg shadow-accent/20 rounded-sm"
          >
            + Nueva Entrada
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            className="px-6 py-3 border border-white/20 text-white/80 text-3xs uppercase font-black tracking-widest hover:bg-white/10 transition-all rounded-sm"
          >
            ← Volver al listado
          </button>
        )}
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="glass-panel border border-white/10 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-3xs uppercase font-black tracking-widest text-accent border-b border-white/10">
                <tr>
                  <th className="p-4">Imagen</th>
                  <th className="p-4">Título</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80 font-light">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt=""
                            className="h-12 w-12 rounded object-cover border border-white/10"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-white/10 flex items-center justify-center text-xs text-white/40">
                            Sin foto
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {post.titulo_es}
                        {post.titulo_eu && (
                          <span className="block text-xs text-white/40 italic font-normal">
                            EU: {post.titulo_eu}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 text-3xs font-black uppercase tracking-widest rounded-sm ${
                            post.published
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {post.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-white/40 font-mono">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setError(null);
                            setView('edit');
                          }}
                          className="text-accent hover:underline text-3xs font-black uppercase tracking-widest"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={isPending}
                          className="text-rose-400 hover:underline text-3xs font-black uppercase tracking-widest disabled:opacity-50"
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-white/40 italic">
                      No hay entradas publicadas aún. Pulsa "+ Nueva Entrada" para crear una.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT FORM VIEW */}
      {(view === 'create' || view === 'edit') && (
        <div className="glass-panel border border-white/10 p-8 rounded-sm space-y-6">
          <h3 className="text-xl font-display text-white italic">
            {view === 'create' ? 'Crear Nueva Entrada en el Blog' : 'Editar Entrada del Blog'}
          </h3>

          {error && (
            <div className="p-4 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm rounded-sm">
              {error}
            </div>
          )}

          <form action={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-3xs uppercase font-black tracking-widest text-accent mb-2">
                  Título (Español) *
                </label>
                <input
                  type="text"
                  name="titulo_es"
                  required
                  defaultValue={editingPost?.titulo_es || ''}
                  className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white outline-none focus:border-accent rounded-sm"
                />
              </div>

              <div>
                <label className="block text-3xs uppercase font-black tracking-widest text-accent mb-2">
                  Título (Euskera)
                </label>
                <input
                  type="text"
                  name="titulo_eu"
                  defaultValue={editingPost?.titulo_eu || ''}
                  className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white outline-none focus:border-accent rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-3xs uppercase font-black tracking-widest text-accent mb-2">
                Contenido (Español, Markdown) *
              </label>
              <textarea
                name="contenido_es"
                required
                rows={8}
                defaultValue={editingPost?.contenido_es || ''}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white/90 font-mono outline-none focus:border-accent rounded-sm"
              />
            </div>

            <div>
              <label className="block text-3xs uppercase font-black tracking-widest text-accent mb-2">
                Contenido (Euskera, Markdown)
              </label>
              <textarea
                name="contenido_eu"
                rows={8}
                defaultValue={editingPost?.contenido_eu || ''}
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white/90 font-mono outline-none focus:border-accent rounded-sm"
              />
            </div>

            <div>
              <label className="block text-3xs uppercase font-black tracking-widest text-accent mb-2">
                Imagen {view === 'edit' && '(Deja vacío para conservar la actual)'}
              </label>
              {editingPost?.image_url && (
                <img
                  src={editingPost.image_url}
                  alt=""
                  className="h-24 w-24 object-cover rounded-sm border border-white/10 mb-3"
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-3xs file:font-black file:uppercase file:bg-accent file:text-nautical-black hover:file:bg-white cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                name="published"
                id="published"
                defaultChecked={editingPost ? editingPost.published : true}
                className="h-5 w-5 accent-amber-400 cursor-pointer"
              />
              <label htmlFor="published" className="text-sm font-medium text-white cursor-pointer">
                Publicar inmediatamente (visible en la web)
              </label>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-4 bg-accent text-nautical-black font-black uppercase text-3xs tracking-[0.2em] rounded-sm hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
              >
                {isPending ? 'Guardando...' : view === 'create' ? 'Publicar Entrada' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-8 py-4 border border-white/20 text-white/60 font-black uppercase text-3xs tracking-widest rounded-sm hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
