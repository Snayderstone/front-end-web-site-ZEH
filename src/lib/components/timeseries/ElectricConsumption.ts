export interface Electrodomestico {
  nombre: string;
  consumo: number;
}

export interface ConfiguracionSimulacion {
  electrodomesticos: { [key: string]: number };
  dias_historicos: number;
  orden_arima: [number, number, number];
  intervalo_confianza: number;
}

export interface ResultadoHistorico {
  Fecha: string;
  [key: string]: number | string;
}

export interface IntervaloConfianza {
  inferior: number;
  superior: number;
}

export interface Prediccion {
  fecha_prediccion: string;
  consumo_predicho: number;
  intervalo_confianza: IntervaloConfianza;
}

export interface ResultadoSimulacion {
  status: string;
  results: {
    historico: ResultadoHistorico[];
    prediccion: Prediccion;
  };
} 