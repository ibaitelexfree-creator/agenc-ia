// activities.ts
export interface Activity {
  id: string;
  icon: string;
  emoji_bg: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color_accent: string;
}

export const activities: Activity[] = [
  {
    id: "01",
    icon: "⛵",
    emoji_bg: "🌊",
    title: "Navegación en Velero",
    subtitle: "Bautismo de vela",
    description: "Salida al mar con instructoras/es titulados. Aprenden cómo funciona un barco, rumbos, maniobras básicas y normas de seguridad, reforzando la autoestima y la toma de decisiones.",
    tags: ["Autonomía", "Seguridad", "Trabajo en equipo"],
    color_accent: "#E63900" // corporate orange-red
  },
  {
    id: "02",
    icon: "🏄",
    emoji_bg: "💧",
    title: "Big SUP",
    subtitle: "Tabla gigante colectiva",
    description: "Unos 10 alumnos reman de forma coordinada. Se trabajan el equilibrio, la cooperación real y la escucha activa en una actividad muy participativa.",
    tags: ["Coordinación", "Cooperación", "Escucha activa"],
    color_accent: "#0f4080" // corporate blue
  },
  {
    id: "03",
    icon: "🐧",
    emoji_bg: "❄️",
    title: "Taller Antártida",
    subtitle: "Ciencia y conciencia",
    description: "A través del documental de la travesía a la Antártida, el alumnado descubre el ecosistema polar, la fauna marina y los efectos del cambio climático.",
    tags: ["Medio ambiente", "Ciencia", "Cambio climático"],
    color_accent: "#1A1A1A" // dark grey/black
  }
];
