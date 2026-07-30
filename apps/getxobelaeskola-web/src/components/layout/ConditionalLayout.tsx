'use client';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import AcademyControls from '@/components/layout/AcademyControls';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const NotificationContainer = dynamic(() => import('@/components/academy/notifications/NotificationContainer'), { ssr: false });
const RealtimeNotifications = dynamic(() => import('@/components/academy/notifications/RealtimeNotifications'), { ssr: false });
const SmartNotificationManager = dynamic(() => import('@/components/academy/notifications/SmartNotificationManager'), { ssr: false });
const SafetyMonitor = dynamic(() => import('@/components/academy/notifications/SafetyMonitor'), { ssr: false });
const ActivityTracker = dynamic(() => import('@/components/academy/ActivityTracker'), { ssr: false });

interface ConditionalLayoutProps {
    children: ReactNode;
    navbar?: ReactNode;
    footer?: ReactNode;
}

export default function ConditionalLayout({ children, navbar, footer }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const isAcademy = pathname.includes('/academy');
    const isAuth = pathname.includes('/auth/');

    // Default to false (SSR/Web)
    const [isNativeApp, setIsNativeApp] = useState(false);

    useEffect(() => {
        // Check if running in a native Capacitor environment (iOS/Android)
        import('@capacitor/core').then(({ Capacitor }) => {
            if (Capacitor.isNativePlatform()) {
                setIsNativeApp(true);
            }
        });
    }, []);

    // Academy mode — no nav, show academy controls
    if (isAcademy) {
        return (
            <>
                <main id="main-content" className="flex-grow flex flex-col relative w-full h-full min-h-screen bg-nautical-black">
                    {children}
                    <AcademyControls />
                </main>
                {!isAuth && isNativeApp && (
                    <div className="block">
                        <MobileBottomNav />
                    </div>
                )}
                <NotificationContainer />
                <RealtimeNotifications />
                <SmartNotificationManager />
                <SafetyMonitor />
                <ActivityTracker />
            </>
        );
    }

    return (
        <>
            {/* Navbar: Visible on Web (Responsive), Hidden on Native App */}
            {!isAuth && !isNativeApp && navbar && (
                <div className="block">{navbar}</div>
            )}

            <main id="main-content" className={`flex-grow min-h-screen bg-nautical-black ${!isAuth ? 'pb-24 md:pb-0' : ''}`}>
                {children}
            </main>

            {/* Footer: Visible on Web (Responsive), Hidden on Native App */}
            {!isAuth && !isNativeApp && footer && (
                <div className="block">{footer}</div>
            )}

            {/* Mobile Navigation: Visible ONLY on Native Mobile App */}
            {!isAuth && isNativeApp && (
                <div className="block">
                    <MobileBottomNav />
                </div>
            )}

            {!isAuth && isAcademy && (
                <>
                    <NotificationContainer />
                    <RealtimeNotifications />
                    <SmartNotificationManager />
                    <SafetyMonitor />
                    <ActivityTracker />
                </>
            )}
        </>
    );
}
