<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fade } from 'svelte/transition';

  export let mediciones: any[] = [];

  let voltageCanvas: HTMLCanvasElement;
  let currentCanvas: HTMLCanvasElement;
  let voltageChart: Chart<'line', number[], string> | undefined;
  let currentChart: Chart<'line', number[], string> | undefined;

  let updating = false;

  function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function createVoltageChart() {
    const ctx = voltageCanvas.getContext('2d');
    if (!ctx) return;

    const labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    const voltageData = mediciones.map(m => m.voltaje_sensorcorriente_bateria_v).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Voltaje (V)',
            data: voltageData,
            borderColor: '#4ade80',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Voltaje (V)'
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

  function createCurrentChart() {
    const ctx = currentCanvas.getContext('2d');
    if (!ctx) return;

    const labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    const currentData = mediciones.map(m => m.corriente_sensor_bateria_ma).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Corriente (mA)',
            data: currentData,
            borderColor: '#fb923c',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Corriente (mA)'
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
    voltageChart = createVoltageChart();
    currentChart = createCurrentChart();

    return () => {
      voltageChart?.destroy();
      currentChart?.destroy();
    };
  });

  $: if (mediciones.length && voltageChart && currentChart) {
    updating = true;
    // Actualizar datos
    voltageChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    voltageChart.data.datasets[0].data = mediciones.map(m => m.voltaje_sensorcorriente_bateria_v).reverse();
    currentChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    currentChart.data.datasets[0].data = mediciones.map(m => m.corriente_sensor_bateria_ma).reverse();
    
    // Actualizar con animación
    voltageChart.update('active');
    currentChart.update('active');
    
    setTimeout(() => {
      updating = false;
    }, 300);
  }
</script>

<div class="charts-container" in:fade={{ duration: 300 }}>
  <div class="chart-card" class:updating>
    <h3>Voltaje de la Batería vs Tiempo</h3>
    <canvas bind:this={voltageCanvas}></canvas>
  </div>

  <div class="chart-card" class:updating>
    <h3>Corriente de la Batería vs Tiempo</h3>
    <canvas bind:this={currentCanvas}></canvas>
  </div>
</div>

<style lang="scss">
  .chart-card {
    background: var(--color--card-background);
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--card-shadow-hover);
    }

    &.updating {
      transform: scale(1.01);
      box-shadow: var(--card-shadow-hover);
    }

    h3 {
      font-family: var(--font--title);
      color: var(--color--text);
      font-size: 1rem;
      margin-bottom: 1rem;
      padding-left: 0.5rem;
      border-left: 3px solid currentColor;
    }
  }

  .charts-container {
    display: grid;
    gap: 1.5rem;
  }
</style> 