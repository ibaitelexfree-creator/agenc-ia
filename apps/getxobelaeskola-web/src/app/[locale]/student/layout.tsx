import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Fetch profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', user.id)
            .single();

        if (profile && (profile.rol === 'admin' || profile.rol === 'instructor')) {
            redirect(`/${locale}/staff`);
        }
    }

    return <>{children}</>;
}
