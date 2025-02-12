<script lang="ts">
	import type {
		SolarSystemConfig,
		OptimizationResults
	} from '$lib/components/lenarprogramming/InterfaceSolar1';
	import Button from '$lib/components/atoms/Button.svelte';
	import Sparkles from '$lib/components/atoms/Sparkles.svelte';
	import { fade, fly } from 'svelte/transition';
	import SolarPanelVisualization from './SolarPanelVisualization.svelte';
	import BatteryVisualization from './BatteryVisualization.svelte';
	import ChargeStateChart from './ChargeStateChart.svelte';
	import { onMount } from 'svelte';
	// Tipamos el resultado y el error
	let resultado: OptimizationResults | null = null;
	let error: string | null = null;

	// Parámetros predeterminados con tipo
	const initialData: SolarSystemConfig = {
		K: 30,
		c1: 100,
		c2: 500,
		c3: 0.05,
		c4: 0.25,
		gamma: 0.9,
		r: 0.2,
		X_max: 20,
		generacion_solar: [],
		consumo_energia: []
	};

	// Inicializamos formData con el tipo correcto
	let formData: SolarSystemConfig = { ...initialData };

	// Añadimos un estado para controlar la carga
	let isLoading = false;
	let key = 0; // Para forzar la recreación de componentes

	async function enviarDatos(): Promise<void> {
		try {
			isLoading = true;
			key++; // Incrementamos la key para forzar recreación

			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/modulo1/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Error en el servidor');
			}

			resultado = (await response.json()) as OptimizationResults;
			error = null;
		} catch (e) {
			resultado = null;
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			isLoading = false;
		}
	}

	function actualizarFormData(): void {
		formData = { ...initialData };
		resultado = null;
		error = null;

	}
</script>

<div class="optimizer-container" in:fade>
	<form
		on:submit|preventDefault={enviarDatos}
		class="optimization-form"
		in:fly={{ y: 20, duration: 600 }}
	>
		<h2>Configuración del Sistema Solar</h2>

		<div class="form-grid">
			<!-- Parámetros del Sistema -->
			<div class="form-section">
				<h3>Parámetros del Sistema</h3>
				<div class="form-group">
					<label for="K" class="label-with-tooltip">
						Días de Simulación:
						<span class="tooltip">Número de días para simular el comportamiento del sistema</span>
					</label>
					<input type="number" id="K" bind:value={formData.K} min="1" max="100" />
				</div>
				<div class="form-group">
					<label for="X_max" class="label-with-tooltip">
						Área Disponible (m²):
						<span class="tooltip">Espacio máximo disponible para la instalación de paneles solares</span>
					</label>
					<input type="number" id="X_max" bind:value={formData.X_max} min="1" />
				</div>
			</div>

			<!-- Costos -->
			<div class="form-section">
				<h3>Costos del Sistema</h3>
				<div class="form-group">
					<label for="c1" class="label-with-tooltip">
						Costo Panel ($/m²):
						<span class="tooltip">Costo por metro cuadrado de panel solar instalado</span>
					</label>
					<input type="number" id="c1" bind:value={formData.c1} min="0" />
				</div>
				<div class="form-group">
					<label for="c2" class="label-with-tooltip">
						Costo Batería ($/kWh):
						<span class="tooltip">Costo por kilovatio-hora de capacidad de almacenamiento</span>
					</label>
					<input type="number" id="c2" bind:value={formData.c2} min="0" />
				</div>
			</div>

			<!-- Eficiencia -->
			<div class="form-section">
				<h3>Parámetros de Eficiencia</h3>
				<div class="form-group">
					<label for="c3" class="label-with-tooltip">
						Beneficio Energía Excedente:
						<span class="tooltip">Tarifa que se recibe por cada kWh de energía sobrante enviada a la red</span>
					</label>
					<input type="range" id="c3" bind:value={formData.c3} min="0" max="1" step="0.01" />
					<span class="value-display">{(formData.c3 * 100).toFixed(1)}%</span>
				</div>
				<div class="form-group">
					<label for="c4" class="label-with-tooltip">
						Costo Energía Alternativa:
						<span class="tooltip">Costo por kWh de usar fuentes alternativas cuando no hay energía solar</span>
					</label>
					<input type="range" id="c4" bind:value={formData.c4} min="0" max="1" step="0.01" />
					<span class="value-display">{(formData.c4 * 100).toFixed(1)}%</span>
				</div>
			</div>
		</div>

		<div class="button-group">
			<Sparkles>
				<Button type="submit" color="primary">Optimizar Sistema</Button>
			</Sparkles>
			<Button color="secondary" on:click={actualizarFormData}>Reiniciar</Button>
		</div>
	</form>

	{#if resultado}
		<div class="results-card" in:fly={{ y: 20, duration: 300 }}>
			<h2>Resultados de la Optimización</h2>

			<!-- ... en la sección de resultados ... -->
			<div class="visualizations-grid">
				{#key key}
				<div class="visualization-wrapper" class:is-loading={isLoading}>
					{#if isLoading}
						<div class="loading-overlay">
							<div class="loading-spinner"></div>
						</div>
					{/if}
					<SolarPanelVisualization width="100%" height="400px" showEffects={true} panelSize={12} />
					<div class="result-overlay">
						<div class="result-item">
							<span class="label">Área del Panel</span>
							<span class="value">{resultado.results.Area_Panel_m2.toFixed(2)} m²</span>
						</div>
					</div>
				</div>

				<div class="visualization-wrapper" class:is-loading={isLoading}>
					{#if isLoading}
						<div class="loading-overlay">
							<div class="loading-spinner"></div>
						</div>
					{/if}
					<BatteryVisualization width="100%" height="400px" chargeLevel={75} />
					<div class="result-overlay">
						<div class="result-item">
							<span class="label">Capacidad de la Batería</span>
							<span class="value">{resultado.results.Capacidad_Bateria_kWh.toFixed(2)} kWh</span>
						</div>
					</div>
				</div>
				{/key}
			</div>

			<div class="chart-section">
				<h3>Estados de Carga por Período</h3>
				{#key key}
				<ChargeStateChart data={{
					Consumo_Energetico_kWh: resultado.results.Consumo_Energetico_kWh,
					Estado_Carga_kWh: resultado.results.Estado_Carga_kWh,
					Generacion_Solar_kWh_m2: resultado.results.Generacion_Solar_kWh_m2} } />

				{/key}
			</div>
		</div>
	{/if}

	{#if error}
		<div class="error-message" role="alert" in:fly={{ y: 20, duration: 300 }}>
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
			<p>{error}</p>
		</div>
	{/if}
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.optimizer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.optimization-form {
		background: var(--color--card-background);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);

		h2 {
			color: var(--color--text);
			margin-bottom: 2rem;
			text-align: center;
		}

		h3 {
			color: var(--color--text-shade);
			font-size: 1.1rem;
			margin-bottom: 1rem;
		}
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.form-section {
		background: var(--color--primary-tint);
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color--border);
	}

	.form-group {
		margin-bottom: 1.5rem;

		label {
			display: block;
			margin-bottom: 0.5rem;
			color: var(--color--text);
			font-weight: 500;
		}

		input {
			width: 100%;
			padding: 0.75rem;
			border: 1px solid var(--color--border);
			border-radius: 0.5rem;
			background: var(--color--card-background);
			color: var(--color--text);

			&[type='range'] {
				padding: 0.5rem 0;
			}
		}
	}

	.value-display {
		display: block;
		text-align: right;
		color: var(--color--text-shade);
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}



	.button-group {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.results-card {
		margin-top: 2rem;
		background: var(--color--card-background);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);

		h2 {
			color: var(--color--text);
			margin-bottom: 1.5rem;
			text-align: center;
		}
	}

	.result-item {
		background: var(--color--primary-tint);
		padding: 1rem;
		border-radius: 0.5rem;
		text-align: center;

		.label {
			display: block;
			color: var(--color--text-shade);
			font-size: 0.9rem;
			margin-bottom: 0.5rem;
		}

		.value {
			display: block;
			color: var(--color--text);
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.chart-section {
		margin: 2rem 0;

		h3 {
			color: var(--color--text);
			margin-bottom: 1rem;
			text-align: center;
			font-size: 1.2rem;
		}
	}

	.visualizations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.visualization-wrapper {
		position: relative;
		background: var(--color--primary-tint);
		border-radius: 1rem;
		overflow: hidden;
		transition: transform 0.3s ease;

		&:hover {
			transform: translateY(-5px);
		}

		&.is-loading {
			opacity: 0.7;
			pointer-events: none;
		}
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		background: rgba(var(--color--background-rgb), 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--color--primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.result-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		background: linear-gradient(to top, var(--color--card-background) 0%, transparent 100%);
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.result-item {
		text-align: center;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: var(--color--card-background);
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);

		.label {
			display: block;
			color: var(--color--text-shade);
			font-size: 0.9rem;
			margin-bottom: 0.25rem;
		}

		.value {
			display: block;
			color: var(--color--text);
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.error-message {
		margin-top: 2rem;
		background: var(--color--callout-background--error);
		color: var(--color--callout-accent--error);
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		.error-icon {
			width: 1.5rem;
			height: 1.5rem;
			flex-shrink: 0;
		}

		p {
			margin: 0;
		}
	}

	@include for-tablet-portrait-down {
		.optimizer-container {
			padding: 1rem;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
