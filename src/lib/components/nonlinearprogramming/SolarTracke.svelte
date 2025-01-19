<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Estados del componente
	let sunPosition = 0;
	let isAutoMode = true;
	let efficiency = 100;
	let manualAngle = 0;
	let interval: ReturnType<typeof setInterval> | undefined;

	// Configuración
	const SIMULATION_SPEED = 100; // ms por paso
	const MAX_ANGLE = 180;

	const transitionDuration = 300;
	const transitionY = 20;

	// Calcular eficiencia cuando cambian las dependencias
	$: {
		const panelAngle = isAutoMode ? sunPosition : manualAngle;
		const angleDifference = Math.abs(sunPosition - panelAngle);
		efficiency = Math.round(Math.max(0, 100 - angleDifference * 0.8));
	}

	// Función para manejar el movimiento automático del sol
	function startAutoMode() {
		if (isAutoMode && !interval) {
			interval = setInterval(() => {
				sunPosition = (sunPosition + 1) % MAX_ANGLE;
			}, SIMULATION_SPEED);
		}
	}

	// Función para cambiar el modo
	function handleModeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		isAutoMode = target.value === 'auto';
		if (interval) {
			clearInterval(interval);
			interval = undefined;
		}
		if (isAutoMode) startAutoMode();
	}

	// Agregar aria-labels y roles para accesibilidad
	const ariaLabels = {
		mode: 'Seleccionar modo de operación del panel solar',
		angle: 'Ajustar ángulo del panel solar',
		efficiency: 'Eficiencia actual del panel solar'
	};

	onMount(() => {
		startAutoMode();
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div class="solar-tracker" in:fade={{ duration: transitionDuration }}>
	<h2 class="title">Simulador de Seguidor Solar 3D</h2>

	<!-- Panel de Control -->
	<div
		class="control-panel"
		in:fly={{ y: transitionY, duration: transitionDuration, easing: cubicOut }}
	>
		<div class="controls-row">
			<label class="control-label">
				Modo:
				<select
					class="select-control"
					value={isAutoMode ? 'auto' : 'manual'}
					on:change={handleModeChange}
					aria-label={ariaLabels.mode}
				>
					<option value="auto">Automático</option>
					<option value="manual">Manual</option>
				</select>
			</label>
			<div class="efficiency-display" role="status" aria-label={ariaLabels.efficiency}>
				Eficiencia: <span>{efficiency}%</span>
			</div>
		</div>

		{#if !isAutoMode}
			<div class="angle-control" in:scale={{ duration: transitionDuration, easing: cubicOut }}>
				<label class="control-label">
					Ángulo del Panel: {manualAngle}°
					<input
						type="range"
						min="0"
						max="180"
						bind:value={manualAngle}
						class="slider"
						aria-label={ariaLabels.angle}
					/>
				</label>
			</div>
		{/if}
	</div>

	<!-- Visualización -->
	<div
		class="visualization"
		in:fly={{ y: transitionY, duration: transitionDuration, delay: 100, easing: cubicOut }}
	>
		<!-- Panel Solar 3D -->
		<div class="panel-container">
			<!-- Base del Panel -->
			<div class="panel-base" />

			<!-- Panel Principal -->
			<div
				class="panel-main"
				style:transform="rotateX(20deg) rotateY({isAutoMode
					? sunPosition - 90
					: manualAngle - 90}deg) translateZ(20px)"
			>
				<!-- Cara Frontal -->
				<div class="panel-front">
					<div class="panel-grid">
						{#each Array(24) as _, i}
							<div class="panel-cell" />
						{/each}
					</div>
				</div>

				<!-- Cara Lateral -->
				<div class="panel-side" />

				<!-- Cara Superior -->
				<div class="panel-top" />
			</div>
		</div>

		<!-- Sol -->
		<div
			class="sun"
			style:left="{(sunPosition / MAX_ANGLE) * 100}%"
			style:top="30%"
			style:transform="translate(-50%, -50%)"
		/>
	</div>

	<!-- Leyenda -->
	<div class="legend">
		{isAutoMode
			? 'Modo Automático: El panel sigue al sol automáticamente'
			: 'Modo Manual: Ajusta el ángulo del panel usando el control deslizante'}
	</div>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.solar-tracker {
		width: 100%;
		max-width: 42rem;
		margin: 0 auto;
		padding: 2rem;
		background-color: var(--color--card-background);
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		backdrop-filter: blur(10px);
		border: 1px solid var(--color--border);

		// Efecto de cristal (glass morphism)
		background: var(--color--card-background);

		@include for-phone-only {
			padding: 1rem;
			border-radius: 0.5rem;
		}
	}

	.title {
		font-family: var(--font--title);
		font-size: 1.2rem;
		font-weight: 700;
		text-align: left;
		margin-bottom: 1rem;
		color: var(--color--text);
	}

	.control-panel {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: var(--color--input-background);
		border-radius: 0.5rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);

		.controls-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 1rem;

			@include for-phone-only {
				flex-direction: column;
				gap: 1rem;
			}
		}

		.control-label {
			color: var(--color--text);
		}
	}

	.select-control {
		margin-left: 0.5rem;
		padding: 0.5rem;
		border: 1px solid var(--color--border);
		border-radius: 0.25rem;
		background-color: var(--color--input-background);
		color: var(--color--text);

		option {
			background-color: var(--color--card-background);
			color: var(--color--text);
		}

		&:hover {
			border-color: var(--color--primary);
		}

		&:focus {
			outline: none;
			border-color: var(--color--primary);
			box-shadow: 0 0 0 2px rgba(var(--color--primary-rgb), 0.2);
		}
	}

	.efficiency-display {
		font-weight: 500;
		span {
			color: var(--color--success);
		}
	}

	.slider {
		width: 100%;
		margin-top: 0.5rem;
		accent-color: var(--color--primary);

		&::-webkit-slider-thumb {
			background: var(--color--primary);
		}

		&::-moz-range-thumb {
			background: var(--color--primary);
		}

		&::-webkit-slider-runnable-track {
			background: var(--color--border);
		}

		&::-moz-range-track {
			background: var(--color--border);
		}
	}

	.visualization {
		position: relative;
		height: 20rem;
		background: linear-gradient(to bottom, var(--color--waves-start), var(--color--waves-end));
		border-radius: 0.5rem;
		overflow: hidden;
		perspective: 800px;
	}

	.panel-container {
		position: absolute;
		left: 50%;
		bottom: 4rem;
		width: 100%;
		max-width: 20rem;
		transform: translateX(-50%);
		z-index: 10;
	}

	.panel-base {
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 1.5rem;
		height: 5rem;
		background: linear-gradient(to right, var(--color--text-shade) 0%, var(--color--text) 100%);
		transform: translateX(-50%) skewX(-12deg);
		opacity: 0.8;
		box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
	}

	.panel-main {
		position: relative;
		width: 12rem;
		height: 8rem;
		margin: 0 auto;
		transform-style: preserve-3d;
		transition: transform 0.3s ease;
	}

	.panel-front {
		position: absolute;
		inset: 0;
		background-color: #1e293b;
		border: 2px solid var(--color--border);
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
	}

	.panel-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(4, 1fr);
		height: 100%;
		gap: 0.35rem;
		padding: 0.35rem;
	}

	.panel-cell {
		background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
		border-radius: 0.125rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(
				45deg,
				transparent 0%,
				rgba(255, 255, 255, 0.1) 50%,
				transparent 100%
			);
			transform: translateX(-100%);
			animation: shine 3s infinite;
		}
	}

	@keyframes shine {
		0% {
			transform: translateX(-100%);
		}
		20%,
		100% {
			transform: translateX(100%);
		}
	}

	.panel-side {
		position: absolute;
		height: 100%;
		width: 0.5rem;
		background-color: #0f172a;
		right: -0.5rem;
		transform: rotateY(90deg) translateZ(-0.25rem);
		transform-origin: left;
	}

	.panel-top {
		position: absolute;
		width: 100%;
		height: 0.5rem;
		background-color: #0f172a;
		top: -0.5rem;
		transform: rotateX(90deg) translateZ(-0.25rem);
		transform-origin: bottom;
	}

	.sun {
		position: absolute;
		width: 4rem;
		height: 4rem;
		background-color: #fbbf24;
		border-radius: 50%;
		box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
		z-index: 20;
	}

	.legend {
		margin-top: 1rem;
		font-size: 0.875rem;
		color: var(--color--text);
		text-align: center;
		opacity: 0.8;
	}
</style>
