import ComingSoonPlaceholder from '@/components/shared/ComingSoonPlaceholder';

const contentByLocale: Record<string, { title: string; description: string }> = {
    es: {
        title: "Blog de Aprendizaje",
        description: "Consejos de navegación, meteorología, tutoriales sobre nudos marineros y todo el contenido técnico para complementar tus clases."
    },
    eu: {
        title: "Ikaskuntza Bloga",
        description: "Nabigazio aholkuak, meteorologia, marinelen korapiloei buruzko tutorialak eta zure klaseak osatzeko eduki tekniko guztia."
    },
    en: {
        title: "Learning Blog",
        description: "Sailing tips, meteorology, sailor knot tutorials, and technical content to complement your sailing lessons."
    },
    fr: {
        title: "Blog d'Apprentissage",
        description: "Conseils de navigation, météo marine, tutoriels sur les nœuds marins et tout le contenu technique pour compléter vos cours."
    }
};

export default function AprendizajePage({ params }: { params: { locale: string } }) {
    const locale = params?.locale || 'es';
    const content = contentByLocale[locale] || contentByLocale.es;

    return (
        <ComingSoonPlaceholder 
            title={content.title} 
            description={content.description}
            locale={locale}
        />
    );
}
