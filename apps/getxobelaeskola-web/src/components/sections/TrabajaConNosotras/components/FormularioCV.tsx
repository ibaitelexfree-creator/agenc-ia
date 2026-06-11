'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropZone from "./DropZone";
import { trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

interface FloatInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function FloatInput({ id, label, type = "text", value, onChange, required }: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isRaised = focused || hasValue;

  return (
    <div className={styles['float-field']}>
      <motion.label
        htmlFor={id}
        className={styles['float-field__label']}
        animate={isRaised
          ? { y: -20, scale: 0.82, color: "#1A6FA8" }
          : { y: 0,   scale: 1,    color: "#AEAEB2" }
        }
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        className={styles['float-field__input']}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        aria-label={label}
      />
      {/* Barra de foco animada */}
      <motion.div
        className={styles['float-field__bar']}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}

interface FloatTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function FloatTextarea({ id, label, value, onChange }: FloatTextareaProps) {
  const [focused, setFocused] = useState(false);
  const isRaised = focused || value.length > 0;

  return (
    <div className={`${styles['float-field']} ${styles['float-field--textarea']}`}>
      <motion.label
        htmlFor={id}
        className={styles['float-field__label']}
        animate={isRaised
          ? { y: -20, scale: 0.82, color: "#1A6FA8" }
          : { y: 0,   scale: 1,    color: "#AEAEB2" }
        }
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <textarea
        id={id}
        className={`${styles['float-field__input']} ${styles['float-field__textarea']}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        aria-label={label}
      />
      <motion.div
        className={styles['float-field__bar']}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ transformOrigin: "left center" }}
      />
    </div>
  );
}

interface FormularioCVProps {
  locale: string;
}

export default function FormularioCV({ locale }: FormularioCVProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = trabajaTranslations[locale] || trabajaTranslations.es;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      alert(t.validationAttachFile);
      return;
    }
    setSending(true);

    // Simulación de envío de datos del formulario
    await new Promise((r) => setTimeout(r, 1500));

    setSending(false);
    setSent(true);
  };

  return (
    <section id="formulario-cv" className={styles['form-section']}>
      <motion.p
        className={styles['tw-section-eyebrow']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
      >
        {t.formEyebrow}
      </motion.p>

      <motion.h2
        className={styles['form-section__title']}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.formTitle}
      </motion.h2>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            ref={formRef}
            key="form"
            className={styles['cv-form']}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            noValidate
          >
            {/* Fila nombre + email */}
            <div className={styles['cv-form__row']}>
              <FloatInput
                id="nombre"
                label={t.formName}
                value={nombre}
                onChange={setNombre}
                required
              />
              <FloatInput
                id="email"
                label={t.formEmail}
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            {/* Mensaje / experiencia */}
            <FloatTextarea
              id="mensaje"
              label={t.formMessage}
              value={mensaje}
              onChange={setMensaje}
            />

            {/* ZONA DROP */}
            <div className={styles['cv-form__drop-label']}>
              <span className={styles['cv-form__drop-label-text']}>{t.formAttachmentLabel}</span>
              <span className={styles['cv-form__drop-required']}>{t.formAttachmentRequired}</span>
            </div>
            <DropZone onFileAccepted={(file) => setCvFile(file)} locale={locale} />

            {/* Botón de envío */}
            <div className="flex justify-center mt-4">
              <motion.button
                type="submit"
                className={styles['cv-form__submit']}
                disabled={sending || !cvFile}
                whileHover={!sending && cvFile
                  ? { scale: 1.02, transition: { duration: 0.15 } }
                  : {}
                }
                whileTap={!sending && cvFile ? { scale: 0.97 } : {}}
              >
                {sending ? (
                  <motion.span
                    className={styles['cv-form__spinner']}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  t.formSubmit
                )}
              </motion.button>
            </div>

            <p className={styles['cv-form__privacy']}>
              {t.formPrivacy}
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className={styles['cv-form__sent']}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <motion.span
              className={styles['cv-form__sent-icon']}
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ⛵
            </motion.span>
            <h3 className={styles['cv-form__sent-title']}>{t.successTitle}</h3>
            <p className={styles['cv-form__sent-body']}>
              {t.successBody}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
