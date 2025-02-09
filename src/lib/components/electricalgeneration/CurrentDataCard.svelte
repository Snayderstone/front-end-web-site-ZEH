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
    <div class="timestamp">
        <i class="fas fa-clock"></i>
        <span>{timestamp}</span>
    </div>

    <div class="data-sections">
        <section class="data-section battery">
            <h3><i class="fas fa-battery-three-quarters"></i> Batería</h3>
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
            <h3><i class="fas fa-solar-panel"></i> Panel Solar</h3>
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
            <h3><i class="fas fa-cloud-sun"></i> Ambiente</h3>
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
    .current-data-card {
        background: var(--color--card-background);
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: var(--card-shadow);
        margin-bottom: 2rem;
    }

    .timestamp {
        text-align: center;
        color: var(--color--text-shade);
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color--border);

        i {
            margin-right: 0.5rem;
        }
    }

    .data-sections {
        display: grid;
        gap: 2rem;
    }

    .data-section {
        h3 {
            color: var(--color--text);
            font-family: var(--font--title);
            font-size: 1.2rem;
            margin: 0 0 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;

            i {
                color: var(--color--primary);
            }
        }
    }

    .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .data-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: var(--color--background);
        border-radius: 0.5rem;
        transition: transform 0.2s ease;

        &:hover {
            transform: translateY(-2px);
        }


        .label {
            color: var(--color--text-shade);
            font-size: 0.9rem;
        }

        .value {
            color: var(--color--text);
            font-weight: 600;
            font-size: 1.1rem;
        }
    }

    @media (max-width: 768px) {
        .data-grid {
            grid-template-columns: 1fr;
        }
    }
</style> 