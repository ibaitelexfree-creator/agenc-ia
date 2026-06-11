import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import styles from "../EquiposEntrenamiento.module.css";

export default function CTAFinal() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Texto del lado izquierdo que escala sutilmente al scrollear
  const { scrollYProgress } = useScroll({
    target: mounted ? ref : undefined,
    offset: ["start end", "end start"],
  });
  const textScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1.02]);

  return (
    <section ref={ref} className={styles['cta-final']}>

      {/* Panel izquierdo — frase */}
      <motion.div
        className={styles['cta-final__left']}
        style={{ scale: textScale }}
      >
        <motion.p
          className={styles['cta-final__overline']}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          ÚNETE A LA FLOTA
        </motion.p>

        <motion.h2
          className={styles['cta-final__headline']}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Vivid la<br/>
          mar<br/>
          <em>juntas.</em>
        </motion.h2>

        <motion.p
          className={styles['cta-final__tagline']}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Informamos de plazas disponibles<br/>
          sin compromiso.
        </motion.p>
      </motion.div>

      {/* Divisor ondulado SVG animado */}
      <div className={styles['cta-final__divider']} aria-hidden="true">
        <motion.svg viewBox="0 0 20 400" preserveAspectRatio="none"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M10 0 Q18 50 10 100 Q2 150 10 200 Q18 250 10 300 Q2 350 10 400"
            stroke="rgba(15,64,128,0.25)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>
      </div>

      {/* Panel derecho — "Mensaje de radio" */}
      <motion.div
        className={styles['cta-final__right']}
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <div className={styles['radio-msg']}>
          <div className={styles['radio-msg__header']}>
            <span className={styles['radio-msg__label']}>MENSAJE · CANAL 16</span>
            <span className={styles['radio-msg__status']}>EN LÍNEA</span>
          </div>

          {!sent ? (
            <>
              <p className={styles['radio-msg__intro']}>
                Escríbenos y os informamos de los equipos y plazas disponibles.
              </p>

              {/* Botón principal */}
              <motion.a
                href="mailto:info@getxobelaeskola.cloud"
                className={styles['radio-msg__btn']}
                whileHover={{ scale: 1.03, boxShadow: "var(--glow-bio)" }}
                whileTap={{ scale: 0.97 }}
              >
                📡 Enviar mensaje
              </motion.a>

              {/* O por WhatsApp */}
              <motion.a
                href="https://wa.me/34600000000"
                className={`${styles['radio-msg__btn']} ${styles['radio-msg__btn--secondary']}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                💬 WhatsApp
              </motion.a>

              <p className={styles['radio-msg__note']}>
                Respondemos en menos de 24h · Sin compromiso
              </p>
            </>
          ) : (
            /* Estado de "enviado" con animación */
            <motion.div
              className={styles['radio-msg__sent']}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className={styles['radio-msg__sent-icon']}>📡</span>
              <p>¡Mensaje recibido! <br/>Nos ponemos en contacto pronto.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

    </section>
  );
}
