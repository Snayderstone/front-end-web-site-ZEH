<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import type { CasaDoma } from './divices';
    import { devices } from './divices';
    
    export let mediciones: CasaDoma[] = [];
    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;

    function calculateDeviceStats() {
        return devices.map(device => {
            const timeOn = mediciones.filter(m => m[device.field]).length;
            const totalConsumption = timeOn * device.consumption;
            const usagePercentage = (timeOn / mediciones.length) * 100;
            
            return {
                name: device.name,
                icon: device.icon,
                timeOn,
                totalConsumption,
                usagePercentage
            };
        }).sort((a, b) => b.usagePercentage - a.usagePercentage);
    }

    function createChart() {
        const ctx = chartCanvas.getContext('2d');
        if (!ctx) return;

        const stats = calculateDeviceStats();
        
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stats.map(s => `${s.icon} ${s.name}`),
                datasets: [
                    {
                        label: 'Tiempo de Uso (%)',
                        data: stats.map(s => s.usagePercentage),
                        backgroundColor: 'rgba(33, 150, 243, 0.6)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 1,
                        yAxisID: 'porcentaje'
                    },
                    {
                        label: 'Consumo Total (W)',
                        data: stats.map(s => s.totalConsumption),
                        backgroundColor: 'rgba(76, 175, 80, 0.6)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1,
                        yAxisID: 'consumo',
                        type: 'line'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis de Uso y Consumo por Dispositivo',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        color: '#f472b6'
                    },
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const stats = calculateDeviceStats()[context.dataIndex];
                                if (context.datasetIndex === 0) {
                                    return `Tiempo de uso: ${stats.usagePercentage.toFixed(1)}%`;
                                } else {
                                    return `Consumo total: ${stats.totalConsumption.toLocaleString()} W`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    porcentaje: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Tiempo de Uso (%)'
                        }
                    },
                    consumo: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Consumo Total (W)'
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

<div class="analysis-container">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style lang="scss">
    .analysis-container {
        background: var(--color--card-background);
        border-radius: 1rem;
        padding: 1.5rem;
        height: 400px;
        box-shadow: var(--card-shadow);
        margin-top: 2rem;
    }
</style>