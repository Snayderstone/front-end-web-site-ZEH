<script lang="ts">
    import { SCALING_FACTORS, scaleValue } from './SolarScaling';
    import { slide } from 'svelte/transition';

    export let medicion: any;
    export let showScaledValues: boolean = true; // Nueva prop para alternar entre valores Prototipo y escalados

    function formatValue(value: number, decimals: number = 2): string {
        return value?.toFixed(decimals) || '0';
    }

    function formatDate(date: string) {
        const d = new Date(date);
        // Ajustamos 5 horas para UTC-5
        d.setHours(d.getHours() - 5);
        return d.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Funciones de escalamiento
    function getScaledPanelValues(medicion: any) {
        if (!medicion) return { voltage: 0, current: 0, power: 0 };
        
        const scaledVoltage = scaleValue(
            medicion.voltaje_real_panel_v,
            SCALING_FACTORS.PANEL.VOLTAGE_RATIO
        );
        const scaledCurrent = scaleValue(
            medicion.corriente_divisor_panel_a,
            SCALING_FACTORS.PANEL.POWER_RATIO / SCALING_FACTORS.PANEL.VOLTAGE_RATIO
        );
        
        return {
            voltage: scaledVoltage,
            current: scaledCurrent,
            power: scaledVoltage * scaledCurrent
        };
    }

    function getScaledBatteryValues(medicion: any) {
        if (!medicion) return { voltage: 0, current: 0 };
        
        return {
            voltage: scaleValue(
                medicion.voltaje_sensorcorriente_bateria_v,
                SCALING_FACTORS.BATTERY.VOLTAGE_RATIO
            ),
            current: scaleValue(
                medicion.corriente_sensor_bateria_ma / 1000, // Convertir mA a A
                SCALING_FACTORS.BATTERY.CAPACITY_RATIO / SCALING_FACTORS.BATTERY.VOLTAGE_RATIO
            )
        };
    }

    function toggleScaling() {
        showScaledValues = !showScaledValues;
    }

    $: timestamp = medicion ? formatDate(medicion.created_at) : '';

    $: potenciaPanel = medicion ? 
        (medicion.voltaje_real_panel_v * medicion.corriente_divisor_panel_a) : 0;

    $: panelValues = showScaledValues ? getScaledPanelValues(medicion) : {
        voltage: medicion?.voltaje_real_panel_v || 0,
        current: medicion?.corriente_divisor_panel_a || 0,
        power: potenciaPanel
    };

    $: batteryValues = showScaledValues ? getScaledBatteryValues(medicion) : {
        voltage: medicion?.voltaje_sensorcorriente_bateria_v || 0,
        current: (medicion?.corriente_sensor_bateria_ma || 0) / 1000
    };
</script>

<div class="current-data-card">
    <div class="timestamp-container">
        <div class="timestamp-wrapper">
            <div class="timestamp">
                <span class="timestamp-icon">🕒</span>
                <span class="timestamp-text">Última actualización: {timestamp}</span>
            </div>
            <button 
                class="toggle-button" 
                class:active={showScaledValues}
                on:click={toggleScaling}
                transition:slide
            >
                <span class="icon">{showScaledValues ? '📊' : '🔬'}</span>
                <span class="button-text">
                    {showScaledValues ? 'Escalado' : 'Prototipo'}
                </span>
            </button>
        </div>
    </div>

    <div class="data-sections">
        <section class="data-section battery">
            <div class="section-header">
                <i class="fas fa-battery-three-quarters"></i>
                <h3>Batería</h3>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Voltaje {showScaledValues ? '(Escalado)' : '(Prototipo)'}:</span>
                    <span class="value">{formatValue(batteryValues.voltage)} V</span>
                </div>
                <div class="data-item">
                    <span class="label">Corriente {showScaledValues ? '(Escalada)' : '(Prototipo)'}:</span>
                    <span class="value">{formatValue(batteryValues.current)} A</span>
                </div>
            </div>
        </section>

        <section class="data-section solar">
            <div class="section-header">
                <i class="fas fa-solar-panel"></i>
                <h3>Panel Solar</h3>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Potencia {showScaledValues ? '(Escalada)' : '(Prototipo)'}:</span>
                    <span class="value">{formatValue(panelValues.power)} W</span>
                </div>
                <div class="data-item">
                    <span class="label">Voltaje {showScaledValues ? '(Escalado)' : '(Prototipo)'}:</span>
                    <span class="value">{formatValue(panelValues.voltage)} V</span>
                </div>
                <div class="data-item">
                    <span class="label">Corriente {showScaledValues ? '(Escalada)' : '(Prototipo)'}:</span>
                    <span class="value">{formatValue(panelValues.current)} A</span>
                </div>
            </div>
        </section>

        <section class="data-section environment">
            <div class="section-header">
                <i class="fas fa-cloud-sun"></i>
                <h3>Ambiente</h3>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="label">Temperatura:</span>
                    <span class="value">{formatValue(medicion?.temperatura_celcius, 1)}°C</span>
                </div>
                <div class="data-item">
                    <span class="label">Presión:</span>
                    <span class="value">{formatValue(medicion?.presion_hectopascales, 1)} hPa</span>
                </div>
                <div class="data-item">
                    <span class="label">Humedad:</span>
                    <span class="value">{formatValue(medicion?.humedad_percent, 1)}%</span>
                </div>
                <div class="data-item">
                    <span class="label">Luminosidad:</span>
                    <span class="value">{formatValue(medicion?.lux_lumen_m2, 1)} lux</span>
                </div>
            </div>
        </section>
    </div>
</div>

<style lang="scss">
    @import '$lib/scss/breakpoints.scss';

    .current-data-card {
        background: var(--color--card-background);
        border-radius: 1rem;
        box-shadow: var(--card-shadow);
        border: 1px solid var(--color--border);
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: var(--card-shadow-hover);
        }
    }

    .timestamp-container {
        padding: 1rem;
        background: var(--color--background);
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-bottom: 1px solid var(--color--border);
    }

    .timestamp-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        
        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .timestamp {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color--text-shade);
        font-size: 0.9rem;
        
        @media (max-width: 767px) {
            font-size: 0.8rem;
        }
    }

    .toggle-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        border: 1px solid var(--color--border);
        background: var(--color--background);
        color: var(--color--text-shade);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
        
        @media (max-width: 767px) {
            width: 100%;
            max-width: 200px;
            padding: 0.75rem 1rem;
        }

        &:hover {
            border-color: var(--color--primary);
            color: var(--color--primary);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(var(--color--primary-rgb), 0.2);
        }

        &.active {
            background: var(--color--primary);
            color: white;
            border-color: var(--color--primary);

            &:hover {
                background: var(--color--primary-dark);
            }
        }

        .icon {
            font-size: 1.1rem;
        }

        .button-text {
            @media (max-width: 360px) {
                font-size: 0.8rem;
            }
        }
    }

    .data-sections {
        display: grid;
        gap: 2rem;
        padding: 1.5rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--color--border);

        i {
            font-size: 1.4rem;
            color: var(--color--primary);
            filter: drop-shadow(0 2px 4px rgba(var(--color--primary-rgb), 0.3));
        }

        h3 {
            color: var(--color--text);
            font-family: var(--font--title);
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0;
        }
    }

    .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;

        @include for-phone-only {
            grid-template-columns: 1fr;
        }
    }

    .data-item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        background: var(--color--background);
        border-radius: 0.75rem;
        border: 1px solid var(--color--border);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
            transform: translateY(-2px);
            // Quitamos el borde morado en hover
            border-color: inherit;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

            .value {
                color: inherit;
            }
        }

        // Eliminamos el pseudo-elemento que añadía el borde morado
        &::before {
            display: none;
        }
    }

    // Estilos específicos para cada sección con sus colores correspondientes
    .battery .data-item {
        border-left: 3px solid #4ade80;
        &:hover {
            border-color: #4ade80;
            .value {
                color: #4ade80;
            }
        }
    }

    .solar .data-item {
        border-left: 3px solid #60a5fa;
        &:hover {
            border-color: #60a5fa;
            .value {
                color: #60a5fa;
            }
        }
    }

    .environment .data-item {
        border-left: 3px solid #f59e0b;
        &:hover {
            border-color: #f59e0b;
            .value {
                color: #f59e0b;
            }
        }
    }


</style>