<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { fade } from 'svelte/transition';

  export let data: number[] = [];
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  const chartConfig = {
    colors: {
      primary: '#42A5F5',
      secondary: '#64B5F620'
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
        labels: data.map((_, i) => `Período ${i + 1}`),
        datasets: [{
          label: 'Estado de Carga',
          data: data,
          borderColor: '#42A5F5',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Estado de Carga por Período',
            color: '#9e9e9e',
            font: {
              size: 16
            }
          },
          legend: {
            display: false
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
              color: '#9e9e9e'
            }
          },
          y: {
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
    chart.data.labels = data.map((_, i) => `Período ${i + 1}`);
    chart.data.datasets[0].data = data;
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
    color:#9e9e9e;
  }
</style> 