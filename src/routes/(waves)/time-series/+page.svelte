<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import ElectricConsumption from '$lib/components/timeseries/ElectricConsumption.svelte';
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';

</script>

<div class="container">

	<ContentSection>
	<div class="card-overlay">
		<div class="header-section">
			<h1>
				Simulador de predicción del próximo consumo energético. 
				<SparklingHighlight/>
			</h1>
		</div>
		<ElectricConsumption />
	</div>
	</ContentSection>

</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';


	.header-section {
		text-align: center;
		margin-bottom: 3rem;

		h1 {
			font-size: 2.5rem;
			font-family: var(--font--title);
			margin-bottom: 1rem;
			background: linear-gradient(to right, var(--color--text), var(--color--primary));
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
		}

	}

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
