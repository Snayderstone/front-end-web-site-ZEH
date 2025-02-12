// Primero creamos las interfaces necesarias
export interface SolarSystemConfig {
    K: number;
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    gamma: number;
    r: number;
    X_max: number;
    generacion_solar: number[];
    consumo_energia: number[];
  }
  
  export interface OptimizationResults {
    results: {
      Area_Panel_m2: number;
      Capacidad_Bateria_kWh: number;
      Estado_Carga_kWh: number[];
      Consumo_Energetico_kWh: number[];
      Generacion_Solar_kWh_m2: number[];

    };
  }