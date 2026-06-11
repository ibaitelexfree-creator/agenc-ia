// teams.ts — la fuente de verdad de los 3 equipos
export interface Team {
  id: string;
  label: string;
  age: string;
  emoji: string;
  accentColor: string;
  description: string;
  schedule: string;
  focus: string;
  embarcaciones: string[];
  domingosAlMes: number;
  note?: string;
}

export const TEAMS: Team[] = [
  {
    id: "infantil",
    label: "INFANTIL",
    age: "A partir de 5 años",
    emoji: "⚓",
    accentColor: "#0f4080",   // corporate nautical blue
    description:
      "La base del trabajo se realiza en Optimist, con salidas puntuales " +
      "en Raquero o J80. Se mejora la lectura del viento, las maniobras " +
      "y la seguridad en el agua desde un ambiente cercano y motivador.",
    schedule: "Primeros 3 domingos de cada mes",
    focus: "Confianza · Lectura del viento · Toma de decisiones",
    embarcaciones: ["Optimist", "Raquero", "J80"],
    domingosAlMes: 3,
  },
  {
    id: "jovenes",
    label: "JÓVENES",
    age: "A partir de 14 años",
    emoji: "🌊",
    accentColor: "#E63900",   // corporate buoy orange/red
    description:
      "Grupos estables para quienes quieren aprender desde la base " +
      "o seguir creciendo. Se navega en distintas embarcaciones para " +
      "formar navegantes completas y responsables.",
    schedule: "Primeros 3 domingos de cada mes",
    focus: "Cohesión · Comunicación a bordo · Responsabilidad compartida",
    embarcaciones: ["Varios tipos", "J80"],
    domingosAlMes: 3,
  },
  {
    id: "adultas",
    label: "ADULTAS",
    age: "Tecnificación",
    emoji: "🏆",
    accentColor: "#1A1A1A",   // corporate dark sea-foam/black
    description:
      "Tecnificación en Laser/ILCA, 420 y cruceros J80. " +
      "Impartido por monitores especialistas en regata. " +
      "Sesiones de 4 horas, 3 veces al mes, de septiembre a junio.",
    schedule: "3 días al mes · Sesiones de 4 horas",
    focus: "Control del barco · Trimado de velas · Estrategia de regata",
    embarcaciones: ["Laser / ILCA", "420", "J80"],
    domingosAlMes: 3,
    note: "Incluido en Pack Completo Socias · 1.200€/año",
  },
];
