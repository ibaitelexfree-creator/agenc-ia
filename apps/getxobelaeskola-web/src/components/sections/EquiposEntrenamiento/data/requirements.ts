// requirements.ts
export interface Requirement {
  id: string;
  number: string;
  title: string;
  body: string;
  icon: string;
  highlight?: string;
}

export const REQUIREMENTS: Requirement[] = [
  {
    id: "ganas",
    number: "01",
    title: "Ganas de aprender y compartir",
    body:
      "Buscamos personas comprometidas con el compañerismo. " +
      "Las tripulaciones se apoyan, celebran avances y normalizan " +
      "el error como parte del deporte.",
    icon: "🤝",
  },
  {
    id: "nivel",
    number: "02",
    title: "Nivel previo según categoría",
    body:
      "Infantiles y jóvenes pueden empezar desde la base. " +
      "Para adultas se recomienda haber superado el Crucero Iniciación.",
    icon: "⛵",
  },
  {
    id: "licencia",
    number: "03",
    title: "Licencia Federativa",
    body:
      "Obligatoria para entrenar y regate. " +
      "Federación Vasca de Vela · ~64€/año. " +
      "Incluye seguro complementario.",
    icon: "📋",
    highlight: "~64€/año",
  },
  {
    id: "socia",
    number: "04",
    title: "Ser Socia del Club",
    body:
      "Pack Completo: 1.200€/año · 3 días/mes de tecnificación " +
      "guiada (sept–junio) + salidas ilimitadas todo el año.",
    icon: "🏅",
    highlight: "1.200€/año",
  },
];
