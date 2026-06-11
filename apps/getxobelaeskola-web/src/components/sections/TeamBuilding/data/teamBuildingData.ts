export interface BoatPointConfig {
  id: string;
  position: { x: string; y: string };
  key: string;
}

export const J80_POINTS: BoatPointConfig[] = [
  {
    id: "proa",
    position: { x: "20%", y: "45%" },
    key: "proa"
  },
  {
    id: "timon",
    position: { x: "80%", y: "55%" },
    key: "timon"
  },
  {
    id: "vela-mayor",
    position: { x: "48%", y: "22%" },
    key: "vela_mayor"
  },
  {
    id: "winch",
    position: { x: "65%", y: "65%" },
    key: "winch"
  }
];

export const CONTRASTS = [
  { key: "contrast1" },
  { key: "contrast2" },
  { key: "contrast3" }
];

export const JORNADA = [
  { key: "step1", color: "#F7F8FA", faseKey: "land" },
  { key: "step2", color: "#EBF5FB", faseKey: "sea" },
  { key: "step3", color: "#EBF5FB", faseKey: "sea", optional: true },
  { key: "step4", color: "#F7F8FA", faseKey: "land" }
];

export const TRANSFERENCIAS = [
  { key: "trans1", icon: "🔄" },
  { key: "trans2", icon: "📡" },
  { key: "trans3", icon: "🧭" },
  { key: "trans4", icon: "💨" },
  { key: "trans5", icon: "🏆" }
];
