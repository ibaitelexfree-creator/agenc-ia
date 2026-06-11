import Link from 'next/link';
import StaffActivityContainer from '@/components/staff/StaffActivityContainer';

export function generateStaticParams() {
    return ['es', 'eu', 'en', 'fr'].map(locale => ({ locale, userId: 'placeholder' }));
}

export default function StaffActivityPage({
    params: { locale, userId }
}: {
    params: { locale: string; userId: string }
}) {
    return (
        <div className="bg-nautical-black text-sea-foam min-h-screen pt-32 pb-24 px-6 relative admin-theme-override">
            <div className="bg-mesh opacity-10 fixed inset-0 pointer-events-none" />
            <StaffActivityContainer userId={userId} locale={locale} />
        </div>
    );
}
