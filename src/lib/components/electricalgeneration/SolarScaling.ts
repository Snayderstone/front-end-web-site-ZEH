export const SCALING_FACTORS = {
    // Factores de escala para el panel solar
    PANEL: {
        AREA_RATIO: (1.1 * 1.35) / 10000, // Área del prototipo en m²
        POWER_RATIO: 2.4 / 400, // Ratio de potencia (2.4W prototipo / 400W panel real)
        VOLTAGE_RATIO: 13.5 / 48, // Ratio de voltaje (13.5V prototipo / 48V sistema real)
    },
    // Factores de escala para la batería
    BATTERY: {
        CAPACITY_RATIO: 25.16 / 5000, // Ratio de capacidad (25.16Wh prototipo / 5000Wh batería real)
        VOLTAGE_RATIO: 3.7 / 48, // Ratio de voltaje (3.7V prototipo / 48V sistema real)
    }
};

export function scaleValue(value: number, scaleFactor: number): number {
    return value / scaleFactor;
}