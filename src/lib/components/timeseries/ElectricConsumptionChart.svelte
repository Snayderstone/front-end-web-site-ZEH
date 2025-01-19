<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { ResultadoHistorico, Prediccion } from './ElectricConsumption';
  import { fade } from 'svelte/transition';

  export let historicalData: ResultadoHistorico[] = [];
  export let prediction: Prediccion | null = null;

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  // Configuración de colores y estilos
  const chartConfig = {
    colors: {
      historical: {
        border: '#42A5F5',
        background: '#64B5F620'
      },
      prediction: {
        border: '#AB47BC',
        background: 'transparent'
      }
    },
    fonts: {
      family: 'inherit'
    }
  };

  function processHistoricalData(data: ResultadoHistorico[]) {
    return {
      dates: data.map(d => new Date(d.Fecha).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      })),
      consumptions: data.map(d => 
        Object.entries(d)
          .filter(([key, value]) => key !== 'Fecha' && typeof value === 'number')
          .reduce((sum, [_, value]) => sum + (value as number), 0)
      )
    };
  }

  function createChart() {
    if (!chartCanvas) return;
    if (chart) chart.destroy();

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const { dates, consumptions } = processHistoricalData(historicalData);
    const predictionData = Array(consumptions.length).fill(null);

    if (prediction) {
      predictionData.push(prediction.consumo_predicho);
      dates.push(new Date(prediction.fecha_prediccion).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric' 
      }));
    }

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Consumo Histórico',
            data: consumptions,
            borderColor: chartConfig.colors.historical.border,
            backgroundColor: chartConfig.colors.historical.background,
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Predicción',
            data: predictionData,
            borderColor: chartConfig.colors.prediction.border,
            backgroundColor: chartConfig.colors.prediction.background,
            borderWidth: 2,
            borderDash: [5, 5],
            pointStyle: 'star',
            pointRadius: prediction ? 8 : 0,
            pointHoverRadius: prediction ? 10 : 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Evolución del Consumo Energético',
            color: '#9e9e9e',
            font: {
              size: 16,
              family: 'inherit'
            }
          },
          legend: {
            display: true,
            labels: {
              color: '#9e9e9e',
              font: {
                family: 'inherit'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y.toFixed(2)} kWh`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9e9e9e',
              font: {
                family: 'inherit'
              }
            },
            grid: {
              color: 'rgba(158, 158, 158, 0.1)',
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9e9e9e',
              font: {
                family: 'inherit'
              },
              callback: (value) => `${value} kWh`
            },
            grid: {
              color: 'rgba(158, 158, 158, 0.1)',
            }
          }
        }
      }
    });
  }

  $: if (historicalData.length > 0) {
    createChart();
  }

  onMount(() => {
    if (historicalData.length > 0) {
      createChart();
    }
    return () => {
      if (chart) chart.destroy();
    };
  });
</script>

<div class="chart-container" in:fade={{ duration: 300 }}>
  <canvas bind:this={chartCanvas} />
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .chart-container {
    width: 100%;
    height: 400px;
    padding: 1rem;
    color: #9e9e9e;
    background: var(--color--card-background);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-shadow-hover);
    }

    @include for-tablet-portrait-down {
      height: 300px;
    }

    @include for-phone-only {
      height: 250px;
      padding: 0.5rem;
    }
  }
</style>
