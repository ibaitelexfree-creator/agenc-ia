export interface Review {
  id: string
  name: string
  timeAgoEs: string
  timeAgoEu: string
  timeAgoEn: string
  timeAgoFr: string
  rating: number
  textEs: string
  textEu: string
  textEn: string
  textFr: string
  avatarUrl?: string
  source: string
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Juan C.",
    timeAgoEs: "Hace 2 meses",
    timeAgoEu: "Duela 2 hilabete",
    timeAgoEn: "2 months ago",
    timeAgoFr: "Il y a 2 mois",
    rating: 5,
    textEs: "Una experiencia increíble aprendiendo a navegar. El monitor de J80 estuvo súper atento, priorizando siempre la seguridad pero haciéndolo súper divertido.",
    textEu: "Esperientzia paregabea belaontzian ikasten. J80ko monitorea oso adi egon zen uneoro, segurtasuna lehenetsiz baina dena oso dibertigarri eginez.",
    textEn: "An incredible experience learning to sail. The J80 instructor was extremely attentive, always prioritizing safety while making it super fun.",
    textFr: "Une expérience incroyable pour apprendre à naviguer. L'instructeur de J80 était très attentif, privilégiant toujours la sécurité tout en rendant l'activité super amusante.",
    source: "google",
  },
  {
    id: "r2",
    name: "Ane M.",
    timeAgoEs: "Hace 1 mes",
    timeAgoEu: "Duela hilabete 1",
    timeAgoEn: "1 month ago",
    timeAgoFr: "Il y a 1 mois",
    rating: 5,
    textEs: "Bela eskola bikaina. Jende oso atsegina eta profesionala. Nabigatzen ikasteko lekurik onena Getxon, zalantzarik gabe!",
    textEu: "Bela eskola bikaina. Jende oso atsegina eta profesionala. Nabigatzen ikasteko lekurik onena Getxon, zalantzarik gabe!",
    textEn: "Excellent sailing school. Very friendly and professional people. The best place to learn sailing in Getxo, without a doubt!",
    textFr: "Excellente école de voile. Des personnes très chaleureuses et professionnelles. Le meilleur endroit pour apprendre la voile à Getxo, sans aucun doute !",
    source: "google",
  },
  {
    id: "r3",
    name: "Carlos T.",
    timeAgoEs: "Hace 3 meses",
    timeAgoEu: "Duela 3 hilabete",
    timeAgoEn: "3 months ago",
    timeAgoFr: "Il y a 3 mois",
    rating: 5,
    textEs: "Hicimos el curso de vela ligera de fin de semana y nos encantó. El velero estaba impecable y el monitor nos transmitió mucha confianza y calma.",
    textEu: "Asteburuko bela arineko ikastaroa egin genuen eta asko gustatu zitzaigun. Ontzia ezin hobe zegoen eta monitoreak konfiantza eta lasaitasun handia eman zigun.",
    textEn: "We did the weekend dinghy sailing course and loved it. The sailboat was spotless and the instructor conveyed a lot of confidence and calm.",
    textFr: "Nous avons fait le cours de voile légère le week-end et nous avons adoré. Le voilier était impeccable et l'instructeur nous a transmis beaucoup de confiance et de calme.",
    source: "google",
  },
  {
    id: "r4",
    name: "Iratxe L.",
    timeAgoEs: "Hace 5 meses",
    timeAgoEu: "Duela 5 hilabete",
    timeAgoEn: "5 months ago",
    timeAgoFr: "Il y a 5 mois",
    rating: 5,
    textEs: "Guztiz gomendagarria. Segurtasuna oso ondo zainduta eta monitoreak oso gertukoak. Udalekuak ere zoragarriak dira umeentzat.",
    textEu: "Guztiz gomendagarria. Segurtasuna oso ondo zainduta eta monitoreak oso gertukoak. Udalekuak ere zoragarriak dira umeentzat.",
    textEn: "Highly recommended. Safety is well taken care of and the instructors are very friendly. Summer camps are also wonderful for kids.",
    textFr: "Hautement recommandé. La sécurité est très bien gérée et les instructeurs sont très proches. Les camps d'été sont aussi fantastiques pour les enfants.",
    source: "google",
  },
  {
    id: "r5",
    name: "Mikel G.",
    timeAgoEs: "Hace 4 meses",
    timeAgoEu: "Duela 4 hilabete",
    timeAgoEn: "4 months ago",
    timeAgoFr: "Il y a 4 mois",
    rating: 5,
    textEs: "Un club con un ambiente increíble. No es solo aprender a navegar, es la comunidad que se crea después de cada salida en el puerto de Getxo.",
    textEu: "Giro bikaina duen kluba. Ez da soilik nabigatzen ikastea, irteera bakoitzaren ondoren Getxoko portuan sortzen den komunitatea baizik.",
    textEn: "A club with an amazing atmosphere. It's not just about learning to sail, it's the community that is built after each outing in the port of Getxo.",
    textFr: "Un club avec une ambiance incroyable. Ce n'est pas seulement apprendre à naviguer, c'est la communauté qui se crée après chaque sortie au port de Getxo.",
    source: "google",
  },
  {
    id: "r6",
    name: "Lucía P.",
    timeAgoEs: "Hace 6 meses",
    timeAgoEu: "Duela 6 hilabete",
    timeAgoEn: "6 months ago",
    timeAgoFr: "Il y a 6 mois",
    rating: 5,
    textEs: "Grandes profesionales. El curso de iniciación en velero J80 fue una pasada. Aprendí muchísimo gracias a la paciencia y experiencia del monitor.",
    textEu: "Profesional bikainak. J80 belaontzian hasteko ikastaroa harrigarria izan zen. Asko ikasi nuen monitorearen pazientzia eta esperientziari esker.",
    textEn: "Great professionals. The J80 sailboat initiation course was awesome. I learned a lot thanks to the patience and experience of the instructor.",
    textFr: "Grands professionnels. Le cours d'initiation au voilier J80 était génial. J'ai beaucoup appris grâce à la patience et l'expérience de l'instructeur.",
    source: "google",
  }
];
