export interface Device {
    id: string;
    name: string;
    consumption: number; // consumo en watts
    field: keyof CasaDoma;
    icon: string;
  }
  
  export interface CasaDoma {
    id: number;
    fecha_hora: string;
    lavadora: boolean;
    secadora: boolean;
    refrigerador: boolean;
    microondas: boolean;
    television_1: boolean;
    television_2: boolean;
    equipo_de_sonido: boolean;
    ducha: boolean;
    focos: boolean;
  }
  
  export const devices: Device[] = [
    {
      id: 'washer',
      name: 'Lavadora',
      consumption: 500,
      field: 'lavadora',
      icon: '🧺'
    },
    {
      id: 'dryer',
      name: 'Secadora',
      consumption: 3000,
      field: 'secadora',
      icon: '👕'
    },
    {
      id: 'fridge',
      name: 'Refrigerador',
      consumption: 150,
      field: 'refrigerador',
      icon: '❄️'
    },
    {
      id: 'microwave',
      name: 'Microondas',
      consumption: 1000,
      field: 'microondas',
      icon: '🔥'
    },
    {
      id: 'tv1',
      name: 'TV Principal',
      consumption: 100,
      field: 'television_1',
      icon: '📺'
    },
    {
      id: 'tv2',
      name: 'TV Secundaria',
      consumption: 80,
      field: 'television_2',
      icon: '📺'
    },
    {
      id: 'sound',
      name: 'Equipo de Sonido',
      consumption: 200,
      field: 'equipo_de_sonido',
      icon: '🎵'
    },
    {
      id: 'shower',
      name: 'Ducha Eléctrica',
      consumption: 4500,
      field: 'ducha',
      icon: '🚿'
    },
    {
      id: 'lights',
      name: 'Sistema de Iluminación',
      consumption: 50,
      field: 'focos',
      icon: '💡'
    }
  ];