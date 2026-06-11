// CalendarView.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  getSundaysOfMonth, isTrainingDay,
  MONTH_NAMES, DAY_NAMES
} from "../data/calendar";
import styles from "../EquiposEntrenamiento.module.css";

// Genera los días del mes para pintar la cuadrícula
function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();   // 0=dom
  const offset   = firstDay === 0 ? 6 : firstDay - 1;  // lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarView() {
  const now     = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const ref     = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  const sundays = getSundaysOfMonth(year, month);
  const sundayDates = sundays.map((d) => d.getDate());
  const grid    = getMonthGrid(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Averigua si un día es un domingo de entrenamiento
  const isTraining = (day: number | null) => {
    if (!day) return false;
    const idx = sundayDates.indexOf(day);
    return idx !== -1 && isTrainingDay(idx);
  };
  const isSundayRest = (day: number | null) => {
    if (!day) return false;
    const idx = sundayDates.indexOf(day);
    return idx >= 3;   // 4º+ domingo = libre
  };

  return (
    <section ref={ref} className={styles['calendar-section']}>

      <motion.p
        className={styles['section-eyebrow--light']}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        CALENDARIO DE ENTRENAMIENTOS
      </motion.p>

      <motion.h2
        className={styles['section-title--light']}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Primeros 3 domingos<br/>de cada mes.
      </motion.h2>

      {/* Tarjeta calendario */}
      <motion.div
        className={styles['cal-card']}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Header: navegación de mes */}
        <div className={styles['cal-header']}>
          <motion.button
            className={styles['cal-nav-btn']}
            onClick={prevMonth}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Mes anterior"
          >
            ←
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.span
              key={`${year}-${month}`}
              className={styles['cal-month-label']}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {MONTH_NAMES[month]} {year}
            </motion.span>
          </AnimatePresence>

          <motion.button
            className={styles['cal-nav-btn']}
            onClick={nextMonth}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Mes siguiente"
          >
            →
          </motion.button>
        </div>

        {/* Cabecera de días */}
        <div className={`${styles['cal-grid']} ${styles['cal-grid--header']}`}>
          {DAY_NAMES.map((d) => (
            <span key={d} className={styles['cal-day-name']}>{d}</span>
          ))}
        </div>

        {/* Cuadrícula de días */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${year}-${month}`}
            className={styles['cal-grid']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {grid.map((day, i) => {
              const training = isTraining(day);
              const rest     = isSundayRest(day);

              return (
                <motion.div
                  key={i}
                  className={[
                    styles['cal-day'],
                    !day          ? styles['cal-day--empty']    : "",
                    training      ? styles['cal-day--training'] : "",
                    rest          ? styles['cal-day--rest']     : "",
                  ].join(" ")}
                  whileHover={day ? { scale: 1.15 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {day && (
                    <>
                      <span className={styles['cal-day__num']}>{day}</span>
                      {training && (
                        <motion.span
                          className={styles['cal-day__dot']}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: i * 0.01 }}
                        />
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Leyenda */}
        <div className={styles['cal-legend']}>
          <span className={`${styles['cal-legend__item']} ${styles['cal-legend__item--training']}`}>
            <span className={styles['cal-legend__dot']} />
            Entrenamiento
          </span>
          <span className={styles['cal-legend__item']}>
            <span className={`${styles['cal-legend__dot']} ${styles['cal-legend__dot--rest']}`} />
            Domingo libre
          </span>
        </div>

      </motion.div>
    </section>
  );
}
