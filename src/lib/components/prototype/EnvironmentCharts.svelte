<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fade } from 'svelte/transition';

  export let mediciones: any[] = [];
  let updating = false;

  let temperatureCanvas: HTMLCanvasElement;
  let humidityCanvas: HTMLCanvasElement;
  let luxCanvas: HTMLCanvasElement;
  let temperatureChart: Chart<'line', number[], string> | undefined;
  let humidityChart: Chart<'line', number[], string> | undefined;
  let luxChart: Chart<'line', number[], string> | undefined;

  function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function createTemperatureChart() {
    const ctx = temperatureCanvas.getContext('2d');
    if (!ctx) return;

    const labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    const tempData = mediciones.map(m => m.temperatura_celcius).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: tempData,
            borderColor: '#ef4444',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Temperatura (°C)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Tiempo'
            }
          }
        }
      }
    });
  }

  function createHumidityChart() {
    const ctx = humidityCanvas.getContext('2d');
    if (!ctx) return;

    const labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    const humidityData = mediciones.map(m => m.humedad_percent).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Humedad (%)',
            data: humidityData,
            borderColor: '#3b82f6',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Humedad (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Tiempo'
            }
          }
        }
      }
    });
  }

  function createLuxChart() {
    const ctx = luxCanvas.getContext('2d');
    if (!ctx) return;

    const labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    const luxData = mediciones.map(m => m.lux_lumen_m2).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Luminosidad (lux)',
            data: luxData,
            borderColor: '#f59e0b',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Luminosidad (lux)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Tiempo'
            }
          }
        }
      }
    });
  }

  onMount(() => {
    temperatureChart = createTemperatureChart();
    humidityChart = createHumidityChart();
    luxChart = createLuxChart();

    return () => {
      temperatureChart?.destroy();
      humidityChart?.destroy();
      luxChart?.destroy();
    };
  });

  $: if (mediciones.length && temperatureChart && humidityChart && luxChart) {
    updating = true;
    // Actualizar datos
    temperatureChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    temperatureChart.data.datasets[0].data = mediciones.map(m => m.temperatura_celcius).reverse();
    humidityChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    humidityChart.data.datasets[0].data = mediciones.map(m => m.humedad_percent).reverse();
    luxChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    luxChart.data.datasets[0].data = mediciones.map(m => m.lux_lumen_m2).reverse();
    
    // Actualizar con animación
    temperatureChart.update('active');
    humidityChart.update('active');
    luxChart.update('active');
    
    setTimeout(() => {
      updating = false;
    }, 300);
  }
</script>

<div class="charts-container" in:fade={{ duration: 300 }}>
  <div class="chart-card" class:updating>
    <h3>Temperatura vs Tiempo</h3>
    <canvas bind:this={temperatureCanvas}></canvas>
  </div>

  <div class="chart-card" class:updating>
    <h3>Humedad vs Tiempo</h3>
    <canvas bind:this={humidityCanvas}></canvas>
  </div>

  <div class="chart-card" class:updating>
    <h3>Luminosidad vs Tiempo</h3>
    <canvas bind:this={luxCanvas}></canvas>
  </div>
</div>

<style lang="scss">
  .chart-card {
    background: var(--color--card-background);
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--color--border);
    transition: all 0.3s ease;

    &.updating {
      transform: scale(1.01);
      box-shadow: var(--card-shadow-hover);
    }

    h3 {
      margin-bottom: 1rem;
      font-family: var(--font--title);
      color: var(--color--text);
    }
  }

  .charts-container {
    display: grid;
    gap: 2rem;
    padding: 1rem;
    width: 100%;
  }
</style> 