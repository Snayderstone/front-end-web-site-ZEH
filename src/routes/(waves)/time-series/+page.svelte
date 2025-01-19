<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import ElectricConsumption from '$lib/components/timeseries/ElectricConsumption.svelte';

</script>

<div class="container">
	<ContentSection title="Simulador de Optimización del Tamaño del Panel Solar y la Batería">
	<br />
	<br />
	<div class="card-overlay">
		<ElectricConsumption />
	</div>
	</ContentSection>

</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.card-overlay {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		transform: translateY(-2rem); // Desplaza ligeramente hacia arriba

		// Efecto de elevación
		filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));

		// Responsive
		@include for-tablet-portrait-down {
			transform: translateY(-1rem);
			padding: 0 1rem;
		}

		@include for-phone-only {
			transform: translateY(0);
		}

		// Animación al cargar
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0% {
			transform: translateY(-2rem);
		}
		50% {
			transform: translateY(-2.5rem);
		}
		100% {
			transform: translateY(-2rem);
		}
	}
</style>
