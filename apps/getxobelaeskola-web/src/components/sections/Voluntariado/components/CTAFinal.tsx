'use client';

import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { lanzarConfetti } from '../helpers/confettiHelper';
import { voluntariadoTranslations } from '../data/voluntariadoData';
import styles from '../Voluntariado.module.css';

interface CTAFinalProps {
  locale: string;
}

const EMAIL = "info@getxobelaeskola.cloud";

export function CTAFinal({ locale }: CTAFinalProps) {
  const t = voluntariadoTranslations[locale] || voluntariadoTranslations.es;
  const encodedText = encodeURIComponent(t.whatsappMessage);
  const whatsappUrl = `https://wa.me/34688688688?text=${encodedText}`;

  const handleClick = () => {
    lanzarConfetti();
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  return (
    <motion.div
      className={styles['cta-section']}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
    >
      {/* Frase de cierre */}
      <motion.p
        className={styles['cta-frase']}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <strong>{t.ctaFrase.split('. ')[0]}.</strong>
        <br />
        {t.ctaFrase.split('. ')[1]}
      </motion.p>

      {/* Botón principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <MagneticButton onClick={handleClick}>
          {t.ctaButton}
        </MagneticButton>
      </motion.div>

      {/* Contactos secundarios */}
      <motion.div
        className={styles['cta-contactos']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <a href={`mailto:${EMAIL}`} className={styles['cta-link']}>
          ✉ {EMAIL}
        </a>
        <span className={styles['cta-separator']}>·</span>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${styles['cta-link']} ${styles['cta-link-whatsapp']}`}>
          WhatsApp directo →
        </a>
      </motion.div>
    </motion.div>
  );
}
