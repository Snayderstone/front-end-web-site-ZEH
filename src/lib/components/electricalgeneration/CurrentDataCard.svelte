<script lang="ts">
    export let medicion: any;

    function formatValue(value: number, decimals: number = 2): string {
        return value?.toFixed(decimals) || '0';
    }

    $: timestamp = medicion ? new Date(medicion.created_at).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }) : '';

    $: potenciaPanel = medicion ? 
        (medicion.voltaje_real_panel_v * medicion.corriente_divisor_panel_a).toFixed(2) : '0';
</script>

<div class="current-data-card">
    <div class="timestamp-container">
        <div class="timestamp">
            <span class="timestamp-icon">🕒</span>
            <span class="timestamp-text">Última actualización: {timestamp}</span>
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
                    <span class="label">Voltaje:</span>
                    <span class="value">{formatValue(medicion?.voltaje_sensorcorriente_bateria_v)} V</span>
                </div>
                <div class="data-item">
                    <span class="label">Corriente:</span>
                    <span class="value">{formatValue(medicion?.corriente_sensor_bateria_ma)} mA</span>
                </div>
            </div>
        </section>

        <section class="data-section solar">
            <div class="section-header">
                <i class="fas fa-solar-panel"></i>
                <h3>Panel Solar</h3>
            </div>
            <div class="data-grid">
                <div class="data-item ">
                    <span class="label">Potencia:</span>
                    <span class="value">{potenciaPanel} W</span>
                </div>
                <div class="data-item ">
                    <span class="label">Voltaje:</span>
                    <span class="value">{formatValue(medicion?.voltaje_real_panel_v)} V</span>
                </div>
                <div class="data-item ">
                    <span class="label">Corriente:</span>
                    <span class="value">{formatValue(medicion?.corriente_divisor_panel_a)} A</span>
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
        background: var(--color--background);
        padding: 1rem 1.5rem;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-bottom: 1px solid var(--color--border);
    }

    .timestamp {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color--text-shade);
        font-size: 0.9rem;
        justify-content: center;

        &-icon {
            font-size: 1.1rem;
        }

        &-text {
            font-weight: 500;
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
            border-color: var(--color--primary);
            box-shadow: 0 4px 12px rgba(var(--color--primary-rgb), 0.1);

            .value {
                color: var(--color--primary);
            }
        }

        .label {
            color: var(--color--text-shade);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .value {
            color: var(--color--text);
            font-weight: 600;
            font-size: 1.2rem;
            transition: color 0.3s ease;
        }
    }

    // Estilos específicos para cada sección
    .battery .data-item {
        border-left: 3px solid #4ade80;
    }

    .solar .data-item {
        border-left: 3px solid #60a5fa;
    }

    .environment .data-item {
        border-left: 3px solid #f59e0b;
    }
</style>