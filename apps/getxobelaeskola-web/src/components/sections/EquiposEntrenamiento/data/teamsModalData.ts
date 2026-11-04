import { FlotaModalData } from "../components/modal/FlotaModal";

export const TEAMS_MODAL_DATA: Record<string, FlotaModalData> = {
  infantil: {
    id: "infantil",
    title: "Entrenamientos infantiles continuos",
    shortDesc: "Grupos estables para avanzar en técnica y autonomía todo el año.",
    badge: "EQUIPO INFANTIL",
    age: "Edad mínima: 5 años",
    schedule: "Primeros 3 domingos del mes (10:00 a 15:00)",
    focus: "Confianza · Lectura del viento · Toma de decisiones",
    vessels: ["Optimist", "Raquero", "J80"],
    fullContent: {
      intro: "Grupos estables que se desarrollan tres domingos al mes, pensados para niñas y niños que quieren profundizar y avanzar en técnica durante todo el año. Este formato permite dar continuidad al aprendizaje, consolidar conocimientos y generar un vínculo real tanto con la mar como con el grupo.",
      boatsText: "La base del trabajo se realiza principalmente en Optimist, ya que es una embarcación ideal para aprender desde la autonomía y el control personal. Sin embargo, la idea no es aprender solo un barco, sino aprender a navegar en general. Por eso, de manera puntual y según el momento del grupo y las condiciones, puede haber salidas en otras embarcaciones como Raquero o J80, ampliando así la experiencia y la comprensión global de la navegación.",
      methodText: "Trabajamos la progresión de manera estructurada, respetando los ritmos individuales y fomentando la autonomía desde edades tempranas. Se mejora la lectura del viento, el control de la embarcación, las maniobras y la seguridad personal en el agua, siempre desde un ambiente cercano, tranquilo y motivador.",
      groupValueText: "El hecho de que el grupo sea estable favorece la cohesión, la confianza y el trabajo en equipo. Las niñas y niños no solo evolucionan técnicamente, sino que también ganan responsabilidad, seguridad en sí mismas y capacidad de toma de decisiones en la mar.",
      idealForText: "Es una propuesta ideal para quienes ya han tenido un primer contacto con la navegación y desean seguir creciendo y disfrutando durante todo el año de una manera constante y acompañada."
    }
  },
  jovenes: {
    id: "jovenes",
    title: "Entrenamientos continuos para jóvenes",
    shortDesc: "Perfecciona técnica, trabajo en equipo y confianza todo el año.",
    badge: "EQUIPO JÓVENES",
    age: "Edad mínima: 14 años",
    schedule: "Primeros 3 domingos del mes (10:00 a 15:00)",
    focus: "Cohesión · Comunicación a bordo · Responsabilidad compartida",
    vessels: ["Laser / ILCA", "420", "J80"],
    fullContent: {
      intro: "Grupos estables pensados para jóvenes que quieren aprender a navegar o seguir creciendo en la mar de forma constante y acompañada. Es una propuesta válida tanto para quienes ya tienen experiencia previa como para quienes se inician y quieren dar sus primeros pasos con continuidad.",
      boatsText: "Según el nivel y los objetivos, se navega en distintas embarcaciones (Laser, 420, J80), ampliando la experiencia y la comprensión global de la navegación. La idea es formar navegantes completos, capaces de desenvolverse con seguridad y criterio en la mar.",
      methodText: "Los entrenamientos se desarrollan a lo largo del año, permitiendo una evolución real en técnica, autonomía y trabajo en equipo. Se trabaja desde la base cuando es necesario, y se profundiza en maniobras, lectura del viento y toma de decisiones cuando el grupo ya tiene recorrido. Cada persona avanza desde su punto de partida.",
      groupValueText: "El grupo estable favorece la cohesión, la responsabilidad compartida y el compromiso. Se aprende a coordinarse, a comunicarse mejor a bordo y a asumir roles dentro de la tripulación, reforzando tanto la parte técnica como la humana.",
      idealForText: "Es una propuesta pensada para crecer con calma, ganar confianza y seguir construyendo una relación sólida y autónoma con la mar.",
      extraQuestion: {
        q: "¿Qué se hace si entra un chaval o chavala que no sabe navegar?",
        a: "No hay ningún problema: se le acompaña desde cero con atención personalizada y en embarcaciones escuela estables, integrándose en el equipo paso a paso y respetando su ritmo."
      }
    }
  },
  adultas: {
    id: "adultas",
    title: "Entrenamientos para adultas",
    shortDesc: "Sesiones regulares para ganar autonomía y técnica en equipo, en distintas condiciones.",
    badge: "TECNIFICACIÓN ADULTAS",
    age: "Adultas · Todos los niveles",
    schedule: "3 domingos al mes · Sesiones de 4-5 horas",
    focus: "Control del barco · Trimado de velas · Estrategia de regata",
    vessels: ["Laser / ILCA", "420", "Cruceros J80"],
    fullContent: {
      intro: "Sesiones regulares pensadas para personas adultas que quieren seguir evolucionando en la mar de forma constante y acompañada. Estos entrenamientos permiten consolidar conocimientos, mejorar la técnica y ganar autonomía real a bordo, navegando en distintas condiciones y aprendiendo a adaptarse a ellas con seguridad.",
      boatsText: "Se profundiza en el control del barco, la precisión en las maniobras, el trimado fino de velas y la coordinación dentro de la tripulación en Laser, 420 y cruceros J80. Cada entrenamiento es una oportunidad para pulir detalles, corregir errores y ganar soltura, siempre desde un enfoque práctico y progresivo.",
      methodText: "Las sesiones están impartidas por nuestros monitores con mayor experiencia, especialistas en regata, lo que permite trabajar con un nivel técnico más afinado y una mirada muy precisa sobre maniobras, estrategia y lectura del viento.",
      groupValueText: "Más allá de la técnica, se refuerza la confianza personal y el trabajo en equipo. Se aprende a asumir roles, comunicarse mejor a bordo y tomar decisiones con criterio propio, creando un entorno donde el aprendizaje se vive sin presión y con acompañamiento real.",
      idealForText: "Es una propuesta ideal para quienes ya han realizado cursos previos y desean mantener continuidad, seguir creciendo y sentirse cada vez más autónomas y seguras en la mar."
    }
  }
};
