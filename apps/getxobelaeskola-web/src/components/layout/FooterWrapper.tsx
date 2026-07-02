'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function FooterWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAcademy = pathname?.includes('/academy');
    const isAuth = pathname?.includes('/auth/');

    if (isAcademy || isAuth) {
        return null;
    }
    return <>{children}</>;
}
