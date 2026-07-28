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
