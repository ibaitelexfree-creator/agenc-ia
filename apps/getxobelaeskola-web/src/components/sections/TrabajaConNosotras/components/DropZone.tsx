'use client';

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoatAnimation } from "./BoatAnimation";
import { trabajaTranslations } from "../data/trabajaData";
import styles from "../TrabajaConNosotras.module.css";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  locale: string;
}

export default function DropZone({ onFileAccepted, locale }: DropZoneProps) {
  const [zoneState, setZoneState] = useState<"idle" | "dragover" | "sailing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const t = trabajaTranslations[locale] || trabajaTranslations.es;

  const processFile = useCallback((file: File | undefined) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg(t.fileTypeError);
      setZoneState("error");
      setTimeout(() => setZoneState("idle"), 4000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {  // 5MB max
      setErrorMsg(t.fileSizeError);
      setZoneState("error");
      setTimeout(() => setZoneState("idle"), 4000);
      return;
    }

    // Animar barco
    setZoneState("sailing");

    setTimeout(() => {
      setZoneState("success");
      // Update filename indicator in DOM
      setTimeout(() => {
        const el = document.getElementById("boat-filename");
        if (el) el.textContent = file.name;
      }, 50);
      // Callback to form
      onFileAccepted(file);
    }, 1100);  // boat navigation duration
  }, [onFileAccepted, t]);

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); setZoneState("dragover"); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setZoneState("idle"); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setZoneState("idle");
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const onClick = () => {
    if (zoneState === "success") return;
    inputRef.current?.click();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  return (
    <div className={styles['dropzone-wrapper']}>
      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className={styles['dropzone__input']}
        onChange={onInputChange}
        aria-label="Subir CV"
        tabIndex={-1}
      />

      {/* La zona visual */}
      <motion.div
        className={[
          styles.dropzone,
          styles[`dropzone--${zoneState}`]
        ].join(" ")}
        onClick={onClick}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Zona para arrastrar tu CV"
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        animate={zoneState === "dragover"
          ? { scale: 1.015, borderColor: "#1A6FA8" }
          : { scale: 1, borderColor: zoneState === "success"
              ? "#34C759" : zoneState === "error"
              ? "#FF3B30" : "#AEAEB2"
            }
        }
        transition={{ duration: 0.2 }}
      >
        <BoatAnimation state={zoneState} locale={locale} />
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {zoneState === "error" && (
          <motion.p
            className={styles['dropzone__error']}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ⚠️ {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Opción "Buscar" debajo de la zona */}
      {zoneState !== "success" && (
        <button
          type="button"
          className={styles['dropzone__browse-btn']}
          onClick={onClick}
        >
          {t.dragzoneBrowseBtn}
        </button>
      )}

      {/* Nota de formatos */}
      <p className={styles['dropzone__hint']}>{t.dragzoneHint}</p>
    </div>
  );
}
