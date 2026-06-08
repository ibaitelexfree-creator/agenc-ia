'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

export default function RealtimeNotifications() {
    const { addNotification } = useNotificationStore();
    const supabase = createClient();

    useEffect(() => {
        let active = true;
        let logrosSub: any;
        let skillsSub: any;
        let notificationsSub: any;

        async function setupRealtime() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !active) return;

            // Escuchar Logros
            logrosSub = supabase
                .channel('realtime_logros')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'logros_alumno',
                        filter: `alumno_id=eq.${user.id}`
                    },
                    async (payload: { new: { logro_id: string } }) => {
                        // Obtener detalles del logro
                        const { data: logro } = await supabase
                            .from('logros')
                            .select('*')
                            .eq('id', payload.new.logro_id)
                            .single();

                        if (logro && active) {
                            addNotification({
                                type: 'achievement',
                                title: logro.nombre_es,
                                message: logro.descripcion_es,
                                icon: logro.icono || '🏆',
                                duration: 16000,
                                data: {
                                    rareza: logro.rareza,
                                    puntos: logro.puntos
                                }
                            });
                        }
                    }
                )
                .subscribe();

            // Escuchar Skills (Habilidades)
            skillsSub = supabase
                .channel('realtime_skills')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'student_skills',
                        filter: `student_id=eq.${user.id}`
                    },
                    async (payload: { new: { skill_id: string } }) => {
                        // Obtener detalles de la skill
                        const { data: skill } = await supabase
                            .from('skills')
                            .select('*')
                            .eq('id', payload.new.skill_id)
                            .single();

                        if (skill && active) {
                            addNotification({
                                type: 'skill',
                                title: skill.name,
                                message: skill.description,
                                icon: skill.icon || '⚡',
                                duration: 0,
                                data: {
                                    category: skill.category
                                }
                            });
                        }
                    }
                )
                .subscribe();

            // Escuchar Notificaciones Generales (Feedback, Info)
            notificationsSub = supabase
                .channel('realtime_notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload: { new: any }) => {
                        if (!active) return;
                        const notif = payload.new;
                        addNotification({
                            type: notif.type || 'info',
                            title: notif.title,
                            message: notif.message,
                            icon: notif.type === 'feedback_logbook' ? '📝' : (notif.type === 'feedback_evaluation' ? '✅' : 'ℹ️'),
                            duration: 8000,
                            data: notif.data
                        });
                    }
                )
                .subscribe();
        }

        setupRealtime();

        return () => {
            active = false;
            if (logrosSub) supabase.removeChannel(logrosSub);
            if (skillsSub) supabase.removeChannel(skillsSub);
            if (notificationsSub) supabase.removeChannel(notificationsSub);
        };
    }, [supabase, addNotification]);

    return null;
}
