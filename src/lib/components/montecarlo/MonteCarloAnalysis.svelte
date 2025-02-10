<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import type { SimulationResults, SimulationInput } from './MonteCarloInterface';

  let loading = false;
  let error: string | null = null;
  let results: SimulationResults | null = null;
  let showForm = false;

  let simulationInput: SimulationInput = {
    num_simulaciones: 10000,
    precio_energia_range: [0.05, 0.15],
    produccion_solar_range: [3, 7],
    consumo_energia_range: [10, 30],
    impuesto_mensual: 5,
    region: "SIERRA",
    area_vivienda: 80,
    consumo_mensual: 150
  };

  const regiones = ["SIERRA", "COSTA", "ORIENTE", "INSULAR"];

  async function runSimulation() {
    loading = true;
    error = null;
    showForm = false;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/modulo3/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulationInput)
      });

      if (!response.ok) throw new Error('Error en la simulación');
      const { results: simulationResults } = await response.json();
      
     // Cálculo del factor de inversión
     const costoMetroCuadrado = Math.random() * (590 - 550) + 550;
      const porcentajeInversion = Math.random() * (0.10 - 0.08) + 0.08;
      const inversionTotal = simulationResults.area_vivienda * costoMetroCuadrado;
      const factorInversion = (inversionTotal * porcentajeInversion) / 1000;
      
      // Cálculo del período de recuperación ajustado
      const periodoBase = Math.random() * (9.5 - 7.8) + 7.8;
      const periodoAjustado = (periodoBase - 5) * simulationResults.periodo_recuperacion_promedio;
      
      // Cálculo del ROI anual y acumulado
      const inversionFinal = simulationResults.inversion_promedio * factorInversion;
      const roiAnual = (100 / periodoAjustado); // ROI anual promedio en porcentaje
      const roiAcumulado = roiAnual * periodoAjustado; // ROI total en porcentaje
      const roiAnualDolares = (inversionFinal * roiAnual) / 100; // ROI anual en dólares
      const roiAcumuladoDolares = (inversionFinal * roiAcumulado) / 100; // ROI acumulado en dólares
      
      // Ajuste de resultados
      results = {
        ...simulationResults,
        inversion_promedio: inversionFinal,
        periodo_recuperacion_promedio: periodoAjustado,
        roi_promedio: roiAnual,
        roi_acumulado: roiAcumulado,
        roi_anual_dolares: roiAnualDolares,
        roi_acumulado_dolares: roiAcumuladoDolares
      };
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  }

  const formatNumber = (num: number, decimals = 2) => num.toFixed(decimals);
  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(num);

  onMount(runSimulation);
</script>

<div class="monte-carlo-container" in:fade={{ duration: 300 }}>
  <div class="control-panel">
    <button class="toggle-form" on:click={() => showForm = !showForm}>
      {#if showForm}
        <span>Ocultar Parámetros <i class="fas fa-chevron-up"></i></span>
      {:else}
        <span>Personalizar Simulación <i class="fas fa-chevron-down"></i></span>
      {/if}
    </button>
  </div>

  {#if showForm}
    <div class="simulation-form" in:slide={{ duration: 300, axis: 'y' }} out:slide={{ duration: 300, axis: 'y' }}>
      <h3>Parámetros de Simulación</h3>
      <div class="form-grid">
        <div class="form-group region-group">
          <label id="region-label" for="region-group">Región</label>
          <div id="region-group" class="radio-group" role="radiogroup" aria-labelledby="region-label">
            {#each regiones as region}
              <label class="radio-label">
                <input
                  type="radio"
                  name="region"
                  value={region}
                  bind:group={simulationInput.region}
                />
                <span class="radio-text">{region}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="form-group">
          <label for="area">Área de Vivienda (m²)</label>
          <input type="number" id="area" bind:value={simulationInput.area_vivienda} min="10" max="1000">
        </div>

        <div class="form-group">
          <label for="consumo">Consumo Mensual (kWh)</label>
          <input type="number" id="consumo" bind:value={simulationInput.consumo_mensual} min="1" max="1000">
        </div>

        <div class="form-group">
          <label for="impuesto">Impuesto Mensual ($)</label>
          <input type="number" id="impuesto" bind:value={simulationInput.impuesto_mensual} min="0" max="100">
        </div>

        <div class="form-group">
          <label for="precio_min">Rango de Precio Energía ($/kWh)</label>
          <div class="range-inputs">
            <input type="number" id="precio_min" bind:value={simulationInput.precio_energia_range[0]} min="0" max="1" step="0.01">
            <span>a</span>
            <input type="number" id="precio_max" bind:value={simulationInput.precio_energia_range[1]} min="0" max="1" step="0.01">
          </div>
        </div>

        <div class="form-group">
          <label for="produccion_min">Rango de Producción Solar (kWh/m²/día)</label>
          <div class="range-inputs">
            <input type="number" id="produccion_min" bind:value={simulationInput.produccion_solar_range[0]} min="0" max="10" step="0.1">
            <span>a</span>
            <input type="number" id="produccion_max" bind:value={simulationInput.produccion_solar_range[1]} min="0" max="10" step="0.1">
          </div>
        </div>

        <div class="form-group">
          <label for="consumo_min">Rango de Consumo Energía (kWh/día)</label>
          <div class="range-inputs">
            <input type="number" id="consumo_min" bind:value={simulationInput.consumo_energia_range[0]} min="0" max="100" step="0.1">
            <span>a</span>
            <input type="number" id="consumo_max" bind:value={simulationInput.consumo_energia_range[1]} min="0" max="100" step="0.1">
          </div>
        </div>

        <div class="form-group">
          <label for="simulaciones">Número de Simulaciones</label>
          <input type="number" id="simulaciones" bind:value={simulationInput.num_simulaciones} min="1000" max="100000" step="1000">
        </div>
      </div>

      <button class="run-simulation" on:click={runSimulation}>
        Ejecutar Simulación
      </button>
    </div>
  {/if}

  <div class="results-card" class:loading>
    <h2>Análisis Monte Carlo - Energía Solar</h2>
    
    {#if loading}
      <div class="loading-spinner">
        <span>Calculando simulación...</span>
      </div>
    {:else if error}
      <div class="error-message">
        <p>Error: {error}</p>
        <button on:click={runSimulation}>Reintentar</button>
      </div>
    {:else if results}
      <div class="results-grid">
        <div class="info-section">
          <h3>Información General</h3>
          <div class="info-grid">
            <div class="info-item" data-tooltip="Zona geográfica donde se realizará la instalación solar">
              <span class="label">Región:</span>
              <span class="value">{results.region}</span>
            </div>
            <div class="info-item" data-tooltip="Superficie total de la vivienda en metros cuadrados">
              <span class="label">Área:</span>
              <span class="value">{results.area_vivienda} m²</span>
            </div>
            <div class="info-item" data-tooltip="Consumo promedio mensual de energía eléctrica">
              <span class="label">Consumo Mensual:</span>
              <span class="value">{results.consumo_mensual} kWh</span>
            </div>
          </div>
        </div>

        <div class="metrics-section">
          <h3>Métricas Financieras</h3>
          <div class="metrics-grid">

            <!-- En la sección de visualización de resultados -->

            <!--
            <div class="metric-item" data-tooltip="Valor Presente Neto: Representa el valor actual de todos los flujos de efectivo futuros del proyecto">
              <span class="label">VPN Promedio</span>
              <span class="value highlight">{formatCurrency(results.vpn_promedio)}</span>
            </div>
            -->
            <div class="metric-item" data-tooltip="Costo promedio estimado de la instalación del sistema solar">
              <span class="label">Inversión Promedio</span>
              <span class="value highlight">{formatCurrency(results.inversion_promedio)}</span>
            </div>

            <div class="metric-item" data-tooltip="Tiempo estimado para recuperar la inversión inicial">
              <span class="label">Período Recuperación</span>
              <span class="value highlight">{formatNumber(results.periodo_recuperacion_promedio)} años</span>
            </div>

            <div class="metric-item" data-tooltip="Retorno sobre la Inversión anual promedio">
              <span class="label">ROI Anual</span>
              <span class="value highlight">{formatNumber(results.roi_promedio)}%</span>
              <span class="value">{formatCurrency(results.roi_anual_dolares)}/año</span>
            </div>
            
            <div class="metric-item" data-tooltip="Retorno sobre la Inversión total acumulado">
              <span class="label">ROI Acumulado</span>
              <span class="value highlight">{formatNumber(results.roi_acumulado)}%</span>
              <span class="value">{formatCurrency(results.roi_acumulado_dolares)} total</span>
            </div>

            <div class="metric-item" data-tooltip="Cantidad de energía que el sistema solar producirá en un año">
              <span class="label">Producción Anual</span>
              <span class="value highlight">{formatNumber(results.produccion_anual_promedio)} kWh</span>
            </div>
            <!--
            <div class="metric-item" data-tooltip="Probabilidad de que el proyecto genere beneficios económicos positivos">
              <span class="label">Probabilidad VPN Positivo</span>
              <span class="value highlight">{formatNumber(results.probabilidad_vpn_positivo)}%</span>
            </div>
            -->



          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<!--


-->


<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .monte-carlo-container {
    width: 100%;
  }

  .results-card {
    background: var(--color--card-background);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--color--border);
    transition: all 0.3s ease;

    &.loading {
      opacity: 0.7;
    }

    h2, h3 {
      font-family: var(--font--title);
      color: var(--color--text);
    }

    h2 {
      margin-bottom: 2rem;
      text-align: center;
    }

    h3 {
      margin-bottom: 1rem;
      padding-left: 0.5rem;
      border-left: 3px solid var(--color--primary);
    }
  }

  .results-grid {
    display: grid;
    gap: 2rem;
  }

  .info-grid, .metrics-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .info-item, .metric-item {
    background: var(--color--background);
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    cursor: help;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-shadow);

      &::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        padding: 0.75rem 1rem;
        background: var(--color--text);
        color: var(--color--card-background);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        width: max-content;
        max-width: 300px;
        box-shadow: var(--card-shadow);
        z-index: 10;
        opacity: 0;
        animation: fadeIn 0.2s ease forwards;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: calc(100% + 2px);
        left: 50%;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid var(--color--text);
        opacity: 0;
        animation: fadeIn 0.2s ease forwards;
      }
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

  .metric-item .value.highlight {
    color: var(--color--primary);
    font-size: 1.2rem;
  }

  .loading-spinner {
    text-align: center;
    padding: 2rem;
    color: var(--color--text-shade);
  }

  .error-message {
    text-align: center;
    color: var(--color--error);
    padding: 1rem;

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: var(--color--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--color--primary-dark);
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .control-panel {
    margin-bottom: 1rem;
    text-align: center;
    padding: 1rem 0;
  }

  .toggle-form {
    background: var(--color--primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 2rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    i {
      font-size: 0.8em;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: var(--color--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .simulation-form {
    // ...existing styles...
    background: var(--color--card-background);
    border-radius: 1rem;
    padding: 2rem;
    margin: 0 auto 2rem auto;
    max-width: 1200px;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--color--border);

    h3 {
      margin-bottom: 1.5rem;
      font-family: var(--font--title);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      // ...existing styles...
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        color: var(--color--text);
        font-weight: 500;
        margin-bottom: 0.75rem;
      }

      input {
        padding: 0.75rem;
        border: 1px solid var(--color--border);
        border-radius: 0.5rem;
        background: var(--color--background);
        color: var(--color--text);
        font-size: 1rem;
        width: 100%;

        &:focus {
          outline: none;
          border-color: var(--color--primary);
        }
      }
    }

    .range-inputs {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0.5rem;
      align-items: center;

      span {
        color: var(--color--text-shade);
      }
    }

    .run-simulation {
      margin-top: 2rem;
      width: 100%;
      padding: 1rem;
      background: var(--color--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--color--primary-dark);
      }
    }
  }

  .region-group {
    .radio-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .radio-label {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.75rem;
        background: var(--color--background);
        border: 1px solid var(--color--border);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            border-color: var(--color--primary);
        }

        input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;

            &:checked + .radio-text {
                color: var(--color--primary);
                font-weight: 600;
            }

        }

        .radio-text {
            color: var(--color--text);
            font-size: 0.9rem;
            text-align: center;
            width: 100%;
            transition: color 0.2s ease;
        }
    }
  }
</style>