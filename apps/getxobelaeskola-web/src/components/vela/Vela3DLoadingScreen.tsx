// src/components/vela/Vela3DLoadingScreen.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useVelaScrollStore } from '@/stores/velaScrollStore';

export default function Vela3DLoadingScreen() {
  const isModelLoaded = useVelaScrollStore((s) => s.isModelLoaded);
  const t = useTranslations('que_es_la_vela');

  return (
    <AnimatePresence>
      {!isModelLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center"
        >
          {/* Logo o marca */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#86868B] text-xs uppercase tracking-[0.3em] mb-8"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {t('loading_brand')}
          </motion.p>

          {/* Barra de progreso minimalista */}
          <div className="w-48 h-px bg-[#E8E8ED] relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#0071E3] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          </div>

          {/* Texto sutil */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-[#86868B] text-[10px] uppercase tracking-[0.2em] mt-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {t('loading_text')}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
