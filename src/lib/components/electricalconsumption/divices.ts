export interface Device {
    id: string;
    name: string;
    consumption: number; // consumo en Ws (vatios-segundo) por intervalo de 5 segundos
    consumptionWh: number; // consumo original en Wh para referencia
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

// Función auxiliar para convertir Wh a Ws para 5 segundos
const convertToWattsSecond = (wattsHour: number): number => {
    // 1 Wh = 3600 Ws
    // Para 5 segundos: (Wh * 3600) * (5/3600) = Wh * 5
    return wattsHour * 5;
};

export const devices: Device[] = [
    {
        id: 'washer',
        name: 'Lavadora',
        consumptionWh: 500,
        consumption: convertToWattsSecond(500), // 2500 Ws
        field: 'lavadora',
        icon: '🧺'
    },
    {
        id: 'dryer',
        name: 'Secadora',
        consumptionWh: 3000,
        consumption: convertToWattsSecond(3000), // 15000 Ws
        field: 'secadora',
        icon: '👕'
    },
    {
        id: 'fridge',
        name: 'Refrigerador',
        consumptionWh: 150,
        consumption: convertToWattsSecond(150), // 750 Ws
        field: 'refrigerador',
        icon: '❄️'
    },
    {
        id: 'microwave',
        name: 'Microondas',
        consumptionWh: 1000,
        consumption: convertToWattsSecond(1000), // 5000 Ws
        field: 'microondas',
        icon: '🔥'
    },
    {
        id: 'tv1',
        name: 'TV Principal',
        consumptionWh: 100,
        consumption: convertToWattsSecond(100), // 500 Ws
        field: 'television_1',
        icon: '📺'
    },
    {
        id: 'tv2',
        name: 'TV Secundaria',
        consumptionWh: 80,
        consumption: convertToWattsSecond(80), // 400 Ws
        field: 'television_2',
        icon: '📺'
    },
    {
        id: 'sound',
        name: 'Equipo de Sonido',
        consumptionWh: 200,
        consumption: convertToWattsSecond(200), // 1000 Ws
        field: 'equipo_de_sonido',
        icon: '🎵'
    },
    {
        id: 'shower',
        name: 'Ducha Eléctrica',
        consumptionWh: 4500,
        consumption: convertToWattsSecond(4500), // 22500 Ws
        field: 'ducha',
        icon: '🚿'
    },
    {
        id: 'lights',
        name: 'Sistema de Iluminación',
        consumptionWh: 50,
        consumption: convertToWattsSecond(50), // 250 Ws
        field: 'focos',
        icon: '💡'
    }
];