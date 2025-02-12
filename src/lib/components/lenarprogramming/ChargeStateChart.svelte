<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fade } from 'svelte/transition';

  // Definimos la interfaz para los datos de entrada
  interface ChartData {
    Consumo_Energetico_kWh: number[];
    Estado_Carga_kWh: number[];
    Generacion_Solar_kWh_m2: number[];
  }

  export let data: ChartData;
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  const chartConfig = {
    colors: {
      consumo: '#FF6B6B',      // Rojo para consumo
      estado: '#4ECDC4',       // Verde-azulado para estado de carga
      generacion: '#FFD93D'    // Amarillo para generación solar
    },
    fonts: {
      family: 'inherit'
    }
  };

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.Consumo_Energetico_kWh.map((_, i) => `Período ${i + 1}`),
        datasets: [
          {
            label: 'Consumo Energético',
            data: data.Consumo_Energetico_kWh,
            borderColor: chartConfig.colors.consumo,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4
          },
          {
            label: 'Estado de Carga',
            data: data.Estado_Carga_kWh,
            borderColor: chartConfig.colors.estado,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4
          },
          {
            label: 'Generación Solar',
            data: data.Generacion_Solar_kWh_m2,
            borderColor: chartConfig.colors.generacion,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Métricas Energéticas por Período',
            color: '#9e9e9e',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#9e9e9e',
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kWh`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(158, 158, 158, 0.1)'
            },
            ticks: {
              color: '#9e9e9e'
            }
          },
          y: {
            grid: {
              color: 'rgba(158, 158, 158, 0.1)'
            },
            ticks: {
              color: '#9e9e9e',
              callback: (value) => `${value} kWh`
            },
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  });

  $: if (chart && data) {
    chart.data.labels = data.Consumo_Energetico_kWh.map((_, i) => `Período ${i + 1}`);
    chart.data.datasets[0].data = data.Consumo_Energetico_kWh;
    chart.data.datasets[1].data = data.Estado_Carga_kWh;
    chart.data.datasets[2].data = data.Generacion_Solar_kWh_m2;
    chart.update('none');
  }
</script>

<div class="chart-container" in:fade={{ duration: 300 }}>
  <canvas bind:this={canvas} />
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .chart-container {
    width: 100%;
    height: 400px;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      height: 300px;
      padding: 0.5rem;
    }
  }
</style>