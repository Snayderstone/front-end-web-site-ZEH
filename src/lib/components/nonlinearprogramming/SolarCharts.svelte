<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { fade } from 'svelte/transition';

	export let data: {
		horas: number[];
		radiacion: number[];
		inclinacion: number[];
		orientacion: number[];
		energia: number[];
	};

	let canvasRadiacion: HTMLCanvasElement;
	let canvasInclinacion: HTMLCanvasElement;
	let canvasOrientacion: HTMLCanvasElement;
	let canvasEnergia: HTMLCanvasElement;

	const chartConfig = {
		colors: {
			radiacion: { primary: '#FFA726', secondary: '#FFB74D20' },
			inclinacion: { primary: '#66BB6A', secondary: '#81C78420' },
			orientacion: { primary: '#AB47BC', secondary: '#CE93D820' },
			energia: { primary: '#42A5F5', secondary: '#64B5F620' }
		},
		fonts: {
			family: 'var(--font--text)'
		}
	};

	const createChart = (
		canvas: HTMLCanvasElement,
		label: string,
		datos: number[],
		colors: { primary: string; secondary: string }
	) => {
		const isDarkMode = document.documentElement.classList.contains('dark');

		return new Chart(canvas, {
			type: 'line',
			data: {
				labels: data.horas.map((hora) => `${hora}:00`),
				datasets: [
					{
						label,
						data: datos,
						borderColor: colors.primary,
						backgroundColor: colors.secondary,
						tension: 0.4,
						fill: true,
						borderWidth: 2,
						pointRadius: 4,
						pointHoverRadius: 6
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: `${label} vs Hora`,
						color: '#9e9e9e',
						font: {
							size: 25,
							weight: 'bold'
						}
					},
					legend: {
						labels: {
							color: '#9e9e9e',
							font: {
								family: 'inherit'
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Hora del día',
							color: '#9e9e9e',
							font: {
								family: 'inherit'
							}
						},
						grid: {
							display: false
						},
						ticks: {
							color: '#9e9e9e',
							font: {
								family: 'inherit'
							}
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							display: false
						},
						ticks: {
							color: '#9e9e9e',
							font: {
								family: 'inherit'
							}
						}
					}
				}
			}
		});
	};

	onMount(() => {
		const charts = [
			createChart(canvasRadiacion, 'Radiación Solar', data.radiacion, chartConfig.colors.radiacion),
			createChart(
				canvasInclinacion,
				'Inclinación',
				data.inclinacion,
				chartConfig.colors.inclinacion
			),
			createChart(
				canvasOrientacion,
				'Orientación',
				data.orientacion,
				chartConfig.colors.orientacion
			),
			createChart(canvasEnergia, 'Energía Generada', data.energia, chartConfig.colors.energia)
		];

		return () => {
			charts.forEach((chart) => chart.destroy());
		};
	});
</script>

<div class="charts-container" in:fade={{ duration: 300 }}>
	<div class="charts-grid">
		<div class="chart-card">
			<canvas bind:this={canvasRadiacion} />
		</div>
		<div class="chart-card">
			<canvas bind:this={canvasInclinacion} />
		</div>
		<div class="chart-card">
			<canvas bind:this={canvasOrientacion} />
		</div>
		<div class="chart-card">
			<canvas bind:this={canvasEnergia} />
		</div>
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.charts-container {
		margin-top: 2rem;
		width: 100%;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}
	}

	.chart-card {
		background: var(--color--card-background);
		border-radius: 0.75rem;
		padding: 1.5rem;
		height: 300px;
		color: #9e9e9e;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		border: 1px solid var(--color--border);
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-2px);
		}

		@include for-phone-only {
			padding: 1rem;
			height: 250px;
		}
	}
</style>
