import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/academy/Chatbot'), {
    ssr: false
});

export function generateStaticParams() {
    return ['es', 'eu', 'en', 'fr'].map(locale => ({ locale }));
}

export default function AcademyLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    return (
        <div className="min-h-screen bg-[#0D2137] text-white relative">
            {children}
            <Chatbot />
        </div>
    );
}
