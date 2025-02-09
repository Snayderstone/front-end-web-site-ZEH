<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { CasaDoma } from './divices';
    import { devices } from './divices';
    
    export let mediciones: CasaDoma[] = [];
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;

    function formatDate(date: string) {
      const d = new Date(date);
      d.setHours(d.getHours()); // Ajuste horario UTC-5
      return d.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  
    function createChart() {
      const ctx = chartCanvas.getContext('2d');
      if (!ctx) return;
  
      const data = [...mediciones].reverse();
      
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(m => formatDate(m.fecha_hora)),
          datasets: [
            {
              label: 'Consumo Total (W)',
              data: data.map(m => 
                devices.reduce((acc, device) => 
                  acc + (m[device.field] ? device.consumption : 0), 0)
              ),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Dispositivos Activos',
              data: data.map(m =>
                devices.filter(device => m[device.field]).length
              ),
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              tension: 0.4,
              fill: true,
              yAxisID: 'dispositivos'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Monitoreo de Consumo Eléctrico en Tiempo Real',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              },
              color: 'var(--color--text)'
            },
            legend: {
              position: 'top',
              align: 'center',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: 'var(--color--text-shade)'
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Consumo (W)'
              }
            },
            dispositivos: {
              beginAtZero: true,
              position: 'right',
              title: {
                display: true,
                text: 'Dispositivos Activos'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  
    $: if (mediciones.length > 0 && chartCanvas) {
      if (chart) chart.destroy();
      createChart();
    }
  
    onMount(() => {
      if (mediciones.length > 0) createChart();
      return () => {
        if (chart) chart.destroy();
      };
    });
  </script>
  
  <div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
  </div>
  
  <style lang="scss">
    .chart-container {
      background: var(--color--card-background);
      border-radius: 1rem;
      padding: 1rem;
      height: 400px;
      box-shadow: var(--card-shadow);
    }
  </style>