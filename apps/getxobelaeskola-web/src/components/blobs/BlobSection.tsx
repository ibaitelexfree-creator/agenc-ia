'use client'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { BlobCard } from './BlobCard'
import { BLOB_PATHS } from '@/data/blobPaths'

// Animación de entrada escalonada al hacer scroll
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
}

export function BlobSection() {
  const t = useTranslations('s1')
  const locale = useLocale()

  const CARDS = [
    {
      title: t('card_cursos_title'),
      subtitle: t('card_cursos_subtitle'),
      color: '#2EC4B6',
      videoSrc: '/videos/cursos_optimized.webm',
      imageSrc: '/images/cursos.jpg',
      paths: BLOB_PATHS.cursos,
      href: `/${locale}/servicios/cursos`,
    },
    {
      title: t('card_club_title'),
      subtitle: t('card_club_subtitle'),
      color: '#F4A623',
      videoSrc: '/videos/club_optimized.webm',
      imageSrc: '/images/club.jpg',
      paths: BLOB_PATHS.clubSocias,
      href: `/${locale}/servicios/socias`,
    },
    {
      title: t('card_equipos_title'),
      subtitle: t('card_equipos_subtitle'),
      color: '#1D6FA4',
      videoSrc: '/videos/equipos_optimized.webm',
      imageSrc: '/images/equipos.jpg',
      paths: BLOB_PATHS.equipos,
      href: `/${locale}/servicios/equipos`,
    },
    {
      title: t('card_udalekuak_title'),
      subtitle: t('card_udalekuak_subtitle'),
      color: '#8B5CF6',
      videoSrc: '/videos/udalekuak_optimized.webm',
      imageSrc: '/images/udalekuak.jpg',
      paths: BLOB_PATHS.udalekuak,
      href: `/${locale}/servicios/udalekuak`,
    },
    {
      title: t('card_entidades_title'),
      subtitle: t('card_entidades_subtitle'),
      color: '#0A0A0A',
      videoSrc: '/videos/entidades_optimized.webm',
      imageSrc: '/images/entidades.jpg',
      paths: BLOB_PATHS.entidades,
      href: `/${locale}/servicios/team-building`,
    },
  ]

  return (
    <section className="w-full py-24 px-6 relative z-10" style={{ background: '#F7F9FB' }}>
      {/* Eyebrow text */}
      <motion.p
        className="text-center text-xs tracking-widest uppercase text-gray-400 mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {t('todo_lo_que_ofrecemos')}
      </motion.p>

      {/* Título de sección */}
      <motion.h2
        className="text-center font-bold mb-16 text-gray-900"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {t('tu_mar_tu_club')}
      </motion.h2>

      {/* Los 5 charcos */}
      <motion.div
        className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {CARDS.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <BlobCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Nota legal en femenino */}
      <p className="text-center text-xs text-gray-400 mt-16 italic">
        * Todo lo expuesto en "femenino" se refiere a personas
      </p>
    </section>
  )
}
