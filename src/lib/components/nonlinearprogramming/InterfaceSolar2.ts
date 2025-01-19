export interface SolarPanelConfig {
  area: number;
  efficiency: number;
  avgRadiation: number;
  sunHours: number;
}

export interface OptimizationResult {
  Hora: number;
  'Radiación Solar (kWh/m²)': number;
  'Inclinación (θ)': number;
  'Orientación (φ)': number;
  'Energía Generada (kWh)': number;
} 