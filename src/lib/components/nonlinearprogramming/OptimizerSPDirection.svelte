<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { SolarPanelConfig, OptimizationResult } from '$lib/components/nonlinearprogramming/InterfaceSolar2';
	import { fade, fly } from 'svelte/transition';
	import Button from '$lib/components/atoms/Button.svelte';
	import Sparkles from '$lib/components/atoms/Sparkles.svelte';
	import SolarCharts from './SolarCharts.svelte';

	// Configuración inicial del panel solar
	const initialConfig: SolarPanelConfig = {
		area: 10,
		efficiency: 0.2,
		avgRadiation: 5.5,
		sunHours: 12
	};

	// Estados de la aplicación usando stores
	const results: Writable<OptimizationResult[]> = writable([]);
	const totalEnergy: Writable<number> = writable(0);
	const loading: Writable<boolean> = writable(false);
	const error: Writable<string> = writable('');

	// Estado del formulario
	let formData = { ...initialConfig };

	// Constantes y validación
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/modulo2/';
	const CONSTRAINTS = {
		area: { min: 0, max: 100, step: 0.1 },
		efficiency: { min: 0, max: 1, step: 0.01 },
		radiation: { min: 0, max: 12, step: 0.1 },
		sunHours: { min: 0, max: 24, step: 1 }
	};

	// Validación del formulario
	$: isValid =
		formData.area > CONSTRAINTS.area.min &&
		formData.efficiency <= CONSTRAINTS.efficiency.max &&
		formData.avgRadiation <= CONSTRAINTS.radiation.max &&
		formData.sunHours <= CONSTRAINTS.sunHours.max;

	// Estado para controlar la expansión de resultados
	let showAllResults = false;
	const INITIAL_RESULTS_COUNT = 2;

	// Función para alternar la visualización de resultados
	function toggleResultsView() {
		showAllResults = !showAllResults;
	}

	// Computed para filtrar resultados
	$: displayedResults = showAllResults ? $results : $results.slice(0, INITIAL_RESULTS_COUNT);

	// Preparar datos para los gráficos
	$: chartData =
		$results.length > 0
			? {
					horas: $results.map((r) => r.Hora),
					radiacion: $results.map((r) => r['Radiación Solar (kWh/m²)']),
					inclinacion: $results.map((r) => r['Inclinación (θ)']),
					orientacion: $results.map((r) => r['Orientación (φ)']),
					energia: $results.map((r) => r['Energía Generada (kWh)'])
			  }
			: null;

	async function optimizeSolarPanel() {
		loading.set(true);
		error.set('');

		try {
			const response = await fetch(`${API_URL}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					A: formData.area,
					eta: formData.efficiency,
					I_promedio: formData.avgRadiation,
					horas_sol: formData.sunHours
				})
			});

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`);
			}

			const data = await response.json();

			if (data.status === 'success') {
				results.set(data.results);
				totalEnergy.set(data.total_energy);
			} else {
				throw new Error(data.message || 'Error desconocido en la respuesta');
			}
		} catch (err) {
			error.set(err instanceof Error ? err.message : 'Error al conectar con la API');
			console.error('Error en la optimización:', err);
		} finally {
			loading.set(false);
		}
	}

	function resetForm() {
		formData = { ...initialConfig };
		results.set([]);
		totalEnergy.set(0);
		error.set('');
	}

	const formatNumber = (num: number): string => num.toFixed(2);
</script>

<div class="optimizer-container" in:fade>
	<form
		on:submit|preventDefault={optimizeSolarPanel}
		class="optimization-form"
		in:fly={{ y: 20, duration: 600 }}
	>
		<div class="form-group">
			<label for="area">Área del panel solar (m²)</label>
			<input
				type="number"
				id="area"
				bind:value={formData.area}
				min={CONSTRAINTS.area.min}
				max={CONSTRAINTS.area.max}
				step={CONSTRAINTS.area.step}
				required
				class="form-input"
			/>
		</div>

		<div class="form-group">
			<label for="efficiency">Eficiencia del panel</label>
			<input
				type="range"
				id="efficiency"
				bind:value={formData.efficiency}
				min={CONSTRAINTS.efficiency.min}
				max={CONSTRAINTS.efficiency.max}
				step={CONSTRAINTS.efficiency.step}
				required
				class="slider"
			/>
			<span class="value-display">{(formData.efficiency * 100).toFixed(1)}%</span>
		</div>

		<div class="form-group">
			<label for="avgRadiation">Radiación solar promedio diaria (kWh/m²)</label>
			<input
				type="number"
				id="avgRadiation"
				bind:value={formData.avgRadiation}
				min={CONSTRAINTS.radiation.min}
				max={CONSTRAINTS.radiation.max}
				step={CONSTRAINTS.radiation.step}
				required
				class="form-input"
			/>
		</div>

		<div class="form-group">
			<label for="sunHours">Duración del día (horas)</label>
			<input
				type="range"
				id="sunHours"
				bind:value={formData.sunHours}
				min={CONSTRAINTS.sunHours.min}
				max={CONSTRAINTS.sunHours.max}
				step={CONSTRAINTS.sunHours.step}
				required
				class="slider"
			/>
			<span class="value-display">{formData.sunHours} horas</span>
		</div>

		<div class="button-group">
			<Sparkles>
				<Button type="submit" color="primary" disabled={$loading || !isValid}>
					{$loading ? 'Optimizando...' : 'Optimizar'}
				</Button>
			</Sparkles>
			<Button color="secondary" on:click={resetForm} disabled={$loading}>Reiniciar</Button>
		</div>
	</form>


	<div class="results-container" in:fly={{ y: 20, duration: 800, delay: 200 }}>
		{#if $loading}
			<div class="loading">
				<div class="spinner" />
				<p>Calculando optimización...</p>
			</div>
		{:else if $error}
			<div class="error-message" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="error-icon"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>{$error}</p>
			</div>
		{:else if $results.length > 0}
			<div class="results">
				<h3>Resultados de la Optimización</h3>
				<div class="results-grid">
					{#each displayedResults as result}
						<div class="result-card" in:fly|local={{ y: 20, duration: 300 }}>
							<div class="time">Hora {result.Hora}:00</div>
							<div class="metrics">
								<div class="metric">
									<span class="label">Radiación Solar:</span>
									<span class="value"
										>{formatNumber(result['Radiación Solar (kWh/m²)'])} kWh/m²</span
									>
								</div>
								<div class="metric">
									<span class="label">Inclinación:</span>
									<span class="value">{formatNumber(result['Inclinación (θ)'])}°</span>
								</div>
								<div class="metric">
									<span class="label">Orientación:</span>
									<span class="value">{formatNumber(result['Orientación (φ)'])}°</span>
								</div>
								<div class="metric highlight">
									<span class="label">Energía Generada:</span>
									<span class="value">{formatNumber(result['Energía Generada (kWh)'])} kWh</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if $results.length > INITIAL_RESULTS_COUNT}
					<div class="show-more">
						<Button color="secondary" on:click={toggleResultsView} style="understated">
							{showAllResults ? 'Ver menos' : `Ver ${$results.length - INITIAL_RESULTS_COUNT} más`}
							<svg
								class="arrow-icon"
								class:rotated={showAllResults}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</Button>
					</div>
				{/if}

				<div class="total-energy">
					<h4>Energía Total Generada</h4>
					<p class="total">{formatNumber($totalEnergy)} kWh</p>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if chartData}
<SolarCharts data={chartData} />
{/if}

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.optimizer-container {
		display: grid;
		gap: 2rem;
		padding: 1rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;

		@include for-tablet-landscape-up {
			grid-template-columns: 350px 1fr;
		}
	}

	.optimization-form {
		background: var(--color--card-background);
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);
	}

	.form-group {
		margin-bottom: 1.5rem;

		label {
			display: block;
			margin-bottom: 0.5rem;
			font-weight: 500;
			color: var(--color--text);
		}
	}

	.form-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color--border);
		border-radius: 0.5rem;
		background: var(--color--input-background);
		color: var(--color--text);
		font-size: 1rem;
		transition: all 0.2s ease;

		&:focus {
			outline: none;
			border-color: var(--color--primary);
			box-shadow: 0 0 0 2px rgba(var(--color--primary-rgb), 0.2);
		}
	}

	.slider {
		width: 100%;
		margin: 0.5rem 0;
		accent-color: var(--color--primary);

		&::-webkit-slider-thumb {
			background: var(--color--primary);
		}

		&::-moz-range-thumb {
			background: var(--color--primary);
		}
	}

	.value-display {
		display: block;
		text-align: center;
		font-size: 0.9rem;
		color: var(--color--text-shade);
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.results-container {
		background: var(--color--card-background);
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		color: var(--color--text-shade);

		.spinner {
			width: 2.5rem;
			height: 2.5rem;
			border: 3px solid var(--color--primary-tint);
			border-top-color: var(--color--primary);
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--color--error-light);
		color: var(--color--error);
		border-radius: 0.5rem;

		.error-icon {
			width: 1.5rem;
			height: 1.5rem;
			flex-shrink: 0;
		}
	}

	.results {
		h3 {
			font-family: var(--font--title);
			font-size: 1.5rem;
			margin-bottom: 1.5rem;
			color: var(--color--text);
		}
	}

	.results-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		transition: all 0.3s ease;
	}

	.result-card {
		background: var(--color--input-background);
		border-radius: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--color--border);
		animation: slideIn 0.3s ease forwards;

		.time {
			font-weight: 600;
			color: var(--color--primary);
			margin-bottom: 0.75rem;
		}

		.metrics {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		.metric {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 0.9rem;

			&.highlight {
				margin-top: 0.5rem;
				padding-top: 0.5rem;
				border-top: 1px solid var(--color--border);
				font-weight: 600;

				.value {
					color: var(--color--primary);
				}
			}

			.label {
				color: var(--color--text-shade);
			}
		}
	}

	.total-energy {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--color--primary);
		color: var(--color--primary-contrast);
		border-radius: 0.75rem;
		text-align: center;

		h4 {
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
		}

		.total {
			font-size: 2rem;
			font-weight: 700;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.show-more {
		display: flex;
		justify-content: center;
		margin: 2rem 0;

		:global(button) {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		.arrow-icon {
			width: 1.25rem;
			height: 1.25rem;
			transition: transform 0.3s ease;

			&.rotated {
				transform: rotate(180deg);
			}
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
