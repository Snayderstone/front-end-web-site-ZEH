<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { Prediccion } from './ElectricConsumption';
    import { fade } from 'svelte/transition';
  
    export let prediction: Prediccion | null = null;
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;
  
    function gaussianFunction(x: number, mean: number, sigma: number): number {
      return (1 / (sigma * Math.sqrt(2 * Math.PI))) * 
             Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
    }
  
    function createGaussianData(mean: number, lower: number, upper: number): {x: number[], y: number[]} {
      const sigma = (upper - lower) / (2 * 1.96); // Para un intervalo de confianza del 95%
      const points = 100;
      const range = (upper - lower) * 1.2; // Ampliar un poco el rango para mejor visualización
      const step = range / points;
      
      const x: number[] = [];
      const y: number[] = [];
      
      for (let i = 0; i <= points; i++) {
        const xValue = lower - range * 0.1 + (i * step);
        x.push(xValue);
        y.push(gaussianFunction(xValue, mean, sigma));
      }
      
      return { x, y };
    }
  
    function createChart() {
      if (!chartCanvas || !prediction) return;
      if (chart) chart.destroy();
  
      const ctx = chartCanvas.getContext('2d');
      if (!ctx) return;
  
      const mean = prediction.consumo_predicho;
      const { inferior, superior } = prediction.intervalo_confianza;
      const { x, y } = createGaussianData(mean, inferior, superior);
  
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: x.map(val => val.toFixed(2)),
          datasets: [{
            label: 'Distribución de la predicción',
            data: y,
            borderColor: '#AB47BC',
            backgroundColor: '#AB47BC20',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Distribución Normal de la Predicción',
              color: '#9e9e9e',
              font: {
                size: 16,
                family: 'inherit'
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => `Consumo: ${context.label} kWh`
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Consumo (kWh)',
                color: '#9e9e9e'
              },
              ticks: {
                color: '#9e9e9e',
                maxRotation: 45,
                minRotation: 45
              },
              grid: {
                color: 'rgba(158, 158, 158, 0.1)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Densidad de probabilidad',
                color: '#9e9e9e'
              },
              ticks: {
                color: '#9e9e9e'
              },
              grid: {
                color: 'rgba(158, 158, 158, 0.1)'
              }
            }
          }
        }
      });
    }
  
    $: if (prediction) {
      createChart();
    }
  
    onMount(() => {
      if (prediction) {
        createChart();
      }
      return () => {
        if (chart) chart.destroy();
      };
    });
  </script>
  
  <div class="gaussian-container" in:fade={{ duration: 300 }}>
    <canvas bind:this={chartCanvas} />
  </div>
  
  <style lang="scss">
    .gaussian-container {
      width: 100%;
      height: 300px;
      padding: 1rem;
      background: var(--color--card-background);
      border-radius: 8px;
      box-shadow: var(--card-shadow);
      transition: all 0.3s ease;
  
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--card-shadow-hover);
      }
    }
  </style>