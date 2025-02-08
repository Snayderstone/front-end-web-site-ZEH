<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import type { ConfiguracionSimulacion, ResultadoSimulacion, ResultadoHistorico, Prediccion } from './ElectricConsumption';
  import SimulacionForm from './SimulacionForm.svelte';
  import Sparkles from '$lib/components/atoms/Sparkles.svelte';
  import ConsumptionChart from './ElectricConsumptionChart.svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import GaussianChart from './GaussianChart.svelte';

  let loading = false;
  let error: string | null = null;
  let historicalData: ResultadoHistorico[] = [];
  let prediction: Prediccion | null = null;
  
  // Usar tweened para animación suave del consumo total
  const totalConsumption = tweened(0, {
    duration: 800,
    easing: cubicOut
  });

  let selectedDate: string | null = null;

  async function handleSimulacion(event: CustomEvent<ConfiguracionSimulacion>) {
    loading = true;
    error = null;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/modulo4/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event.detail)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
      }

      const data: ResultadoSimulacion = await response.json();
      
      if (data.status === 'success') {
        historicalData = data.results.historico;
        prediction = data.results.prediccion;
        
        // Actualizar el consumo total con animación
        const newTotal = historicalData.reduce((sum, day) => {
          return sum + Object.values(day)
            .filter(value => typeof value === 'number')
            .reduce((daySum, value) => daySum + value, 0);
        }, 0);
        
        totalConsumption.set(newTotal);
      } else {
        throw new Error('Los datos recibidos no tienen el formato esperado');
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error al obtener datos:', err);
    } finally {
      loading = false;
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="container" in:fade={{ duration: 300 }}>
  <div class="content">
    <section class="form-section" aria-label="Formulario de simulación">
      <SimulacionForm on:submit={handleSimulacion} />
    </section>

    {#if loading}
      <div class="loading-container" in:fade role="alert" aria-busy="true">
        <div class="loading-spinner"></div>
        <p>Procesando simulación...</p>
      </div>
    {:else if error}
      <div class="error-container" in:fade role="alert">
        <p class="error-message">❌ {error}</p>
        <button 
          class="retry-button" 
          on:click={() => error = null}
          aria-label="Cerrar mensaje de error"
        >
          Cerrar
        </button>
      </div>
    {:else if historicalData.length > 0}
      <section class="results-section" in:slide={{ duration: 400 }} aria-label="Resultados de la simulación">
        <div class="results-grid">
          <Sparkles>
            <div class="summary-card">
              <h3>Resumen de Consumo</h3>
              <p>Consumo total: <strong>{$totalConsumption.toFixed(2)} kWh</strong></p>
              <p>Días analizados: <strong>{historicalData.length}</strong></p>
            </div>
          </Sparkles>

          {#if prediction}
            <Sparkles>
              <div class="prediction-card">
                <h3>Predicción</h3>
                <div class="prediction-details">
                  <div class="prediction-value">
                    <span>Fecha:</span>
                    <strong>{formatDate(prediction.fecha_prediccion)}</strong>
                  </div>
                  <div class="prediction-value">
                    <span>Consumo estimado:</span>
                    <strong>{prediction.consumo_predicho.toFixed(2)} kWh</strong>
                  </div>
                  <div class="confidence-interval">
                    <h4>Intervalo de confianza</h4>
                    <div class="interval-values">
                      <div>
                        <span>Mínimo:</span>
                        <strong>{prediction.intervalo_confianza.inferior.toFixed(2)} kWh</strong>
                      </div>
                      <div>
                        <span>Máximo:</span>
                        <strong>{prediction.intervalo_confianza.superior.toFixed(2)} kWh</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Sparkles>
          {/if}
        </div>

        <div class="chart-section">
          <ConsumptionChart 
            {historicalData}
            {prediction}
          />
        </div>

        {#if prediction}
          <div class="chart-section">
            <GaussianChart {prediction} />
          </div>
        {/if}
      </section>
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .content {
    display: grid;
    gap: 2rem;
  }

  .results-section {
    display: grid;
    gap: 1rem;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .summary-card, .prediction-card {
    background: var(--color--card-background);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--card-shadow);

    h3 {
      color: var(--color--text);
      font-family: var(--font--title);
      margin: 0 0 1rem 0;
    }
  }

  .prediction-details {
    .prediction-value {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--color--border);

      span {
        color: var(--color--text-shade);
      }

      strong {
        color: var(--color--text);
      }
    }

    .confidence-interval {
      margin-top: 1rem;

      h4 {
        font-size: 0.9rem;
        margin: 0 0 0.5rem 0;
        color: var(--color--text);
      }

      .interval-values {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        div {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          span {
            color: var(--color--text-shade);
            font-size: 0.9rem;
          }

          strong {
            color: var(--color--text);
          }
        }
      }
    }
  }

  .chart-section {
    margin: 2rem 0;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .loading-container {
    text-align: center;
    padding: 3rem;
    color: var(--color--text-shade);

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color--border);
      border-top-color: var(--color--primary);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
  }

  .error-container {
    text-align: center;
    padding: 2rem;
    background: var(--color--error-background);
    border-radius: 8px;
    
    .error-message {
      color: var(--color--error);
      margin: 0;
    }
  }

  .retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: var(--color--primary);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color--primary-dark);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
