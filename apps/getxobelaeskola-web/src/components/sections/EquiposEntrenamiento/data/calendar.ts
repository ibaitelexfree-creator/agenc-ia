// calendar.ts — calcula los domingos de cualquier mes/año
export function getSundaysOfMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === 0) days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Los primeros 3 domingos son de entrenamiento
export function isTrainingDay(sundayIndex: number): boolean {
  return sundayIndex < 3;   // índice 0,1,2 = entrenamiento
}

export const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export const DAY_NAMES = ["L","M","X","J","V","S","D"];
