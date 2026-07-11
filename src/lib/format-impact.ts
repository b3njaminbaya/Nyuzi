export function formatWater(liters: number) {
  if (liters >= 1000) return `${(liters / 1000).toFixed(1)}k L`;
  return `${Math.round(liters)} L`;
}

export function formatCO2(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg.toFixed(1)} kg`;
}

export function formatLandfill(m3: number) {
  return `${m3.toFixed(1)} m³`;
}
