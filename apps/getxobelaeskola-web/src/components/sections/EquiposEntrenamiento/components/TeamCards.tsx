// TeamCards.tsx
'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import TeamCard from "./TeamCard";
import { TEAMS } from "../data/teams";
import styles from "../EquiposEntrenamiento.module.css";
import { useTranslations } from "next-intl";
import FlotaModal, { FlotaModalData } from "./modal/FlotaModal";
import { TEAMS_MODAL_DATA } from "../data/teamsModalData";

export default function TeamCards() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [selectedModalData, setSelectedModalData] = useState<FlotaModalData | null>(null);
  const t = useTranslations('equipos_entrenamiento.teams');

  const toggle = (id: string) =>
    setActiveTeam((prev) => (prev === id ? null : id));

  const handleOpenModal = (teamId: string) => {
    const modalData = TEAMS_MODAL_DATA[teamId];
    if (modalData) {
      setSelectedModalData(modalData);
    }
  };

  return (
    <>
      <section className={styles['team-cards-section']}>
        <motion.p
          className={styles['section-eyebrow--light']}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          {t('title_eyebrow')}
        </motion.p>

        <motion.h2
          className={styles['section-title--light']}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('title')}
        </motion.h2>

        <div 
          className={styles['team-cards-grid']}
          onMouseLeave={() => setActiveTeam(null)}
        >
          {TEAMS.map((team, i) => (
            <TeamCard
              key={team.id}
              team={team}
              isActive={activeTeam === team.id}
              onToggle={() => toggle(team.id)}
              onOpenModal={() => handleOpenModal(team.id)}
              entryDelay={i * 0.12}
              index={i}
              total={TEAMS.length}
            />
          ))}
        </div>
      </section>

      {/* Modal Popup para cada flota con desenfoque de fondo y cierre interactivo */}
      <FlotaModal
        data={selectedModalData}
        onClose={() => setSelectedModalData(null)}
      />
    </>
  );
}
