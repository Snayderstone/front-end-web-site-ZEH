<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fade } from 'svelte/transition';

  export let mediciones: any[] = [];
  let updating = false;

  let voltageCanvas: HTMLCanvasElement;
  let currentCanvas: HTMLCanvasElement;
  let voltageChart: Chart<'line', number[], string> | undefined;
  let currentChart: Chart<'line', number[], string> | undefined;

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
    const voltageData = mediciones.map(m => m.voltaje_real_panel_v).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Voltaje (V)',
            data: voltageData,
            borderColor: '#60a5fa',
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
    const currentData = mediciones.map(m => m.corriente_divisor_panel_a).reverse();

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Corriente (A)',
            data: currentData,
            borderColor: '#f472b6',
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Corriente (A)'
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
    voltageChart.data.datasets[0].data = mediciones.map(m => m.voltaje_real_panel_v).reverse();
    currentChart.data.labels = mediciones.map(m => formatDateTime(m.created_at)).reverse();
    currentChart.data.datasets[0].data = mediciones.map(m => m.corriente_divisor_panel_a).reverse();
    
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
    <h3>Voltaje del Panel Solar vs Tiempo</h3>
    <canvas bind:this={voltageCanvas}></canvas>
  </div>

  <div class="chart-card" class:updating>
    <h3>Corriente del Panel Solar vs Tiempo</h3>
    <canvas bind:this={currentCanvas}></canvas>
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