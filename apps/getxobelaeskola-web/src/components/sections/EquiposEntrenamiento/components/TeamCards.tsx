// TeamCards.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import TeamCard from "./TeamCard";
import { TEAMS } from "../data/teams";
import styles from "../EquiposEntrenamiento.module.css";

export default function TeamCards() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  const toggle = (id: string) =>
    setActiveTeam((prev) => (prev === id ? null : id));

  return (
    <section className={styles['team-cards-section']}>

      <motion.p
        className={styles['section-eyebrow--light']}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      >
        NUESTROS EQUIPOS
      </motion.p>

      <motion.h2
        className={styles['section-title--light']}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Elige tu flota.
      </motion.h2>

      <div className={styles['team-cards-grid']}>
        {TEAMS.map((team, i) => (
          <TeamCard
            key={team.id}
            team={team}
            isActive={activeTeam === team.id}
            onToggle={() => toggle(team.id)}
            entryDelay={i * 0.12}
          />
        ))}
      </div>

    </section>
  );
}
