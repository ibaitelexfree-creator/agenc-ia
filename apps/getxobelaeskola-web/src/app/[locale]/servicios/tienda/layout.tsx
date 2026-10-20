import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TiendaLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    let isAdmin = false;

    if (authUser) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', authUser.id)
            .single();
        if (profile?.rol === 'admin') {
            isAdmin = true;
        }
    }

    if (!isAdmin) {
        redirect(`/${locale}`);
    }

    return <>{children}</>;
}
