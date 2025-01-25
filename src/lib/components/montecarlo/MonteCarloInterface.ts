export interface SimulationResults {
    area_vivienda: number;
    consumo_mensual: number;
    inversion_promedio: number;
    periodo_recuperacion_promedio: number;
    probabilidad_vpn_positivo: number;
    produccion_anual_promedio: number;
    region: string;
    roi_promedio: number;
    vpn_promedio: number;
  }
  
  export interface SimulationInput {
    num_simulaciones: number;
    precio_energia_range: [number, number];
    produccion_solar_range: [number, number];
    consumo_energia_range: [number, number];
    impuesto_mensual: number;
    region: string;
    area_vivienda: number;
    consumo_mensual: number;
  }