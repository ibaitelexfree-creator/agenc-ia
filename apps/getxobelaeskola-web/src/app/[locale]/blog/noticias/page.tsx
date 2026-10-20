import React from 'react';
import { createClient } from '@/lib/supabase/server';
import NoticiasClient from './NoticiasClient';

export default async function NoticiasPage({ 
    params: { locale },
    searchParams
}: { 
    params: { locale: string };
    searchParams?: { article?: string };
}) {
    const supabase = createClient();
    
    // Consultar artículos desde Supabase
    const { data: dbPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (
        <NoticiasClient 
            locale={locale} 
            initialDbPosts={dbPosts || []} 
            initialArticleSlug={searchParams?.article}
        />
    );
}
