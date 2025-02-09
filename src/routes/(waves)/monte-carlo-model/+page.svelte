<script lang="ts">
	// ... otros imports ...
	import MonteCarloAnalysis from '$lib/components/montecarlo/MonteCarloAnalysis.svelte';
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';

  </script>
  
  <div class="container">
	<ContentSection>
		<div class="header-section">
			<h1>
				Simulador de Inversión
				<SparklingHighlight/>
			</h1>
		</div>

		<div class="content-grid">
			<div class="info-section">
				<div class="info-card">
					<h3>¿Qué es la Simulación Monte Carlo?</h3>
					<p>
						La simulación Monte Carlo es una técnica matemática que permite evaluar el riesgo
						y la incertidumbre en análisis financieros. En este caso, la utilizamos para:
					</p>
					<ul>
						<li>Calcular múltiples escenarios de inversión</li>
						<li>Considerar variaciones en precios de energía</li>
						<li>Evaluar diferentes niveles de producción solar</li>
						<li>Estimar el retorno de inversión probable</li>
					</ul>
					<div class="disclaimer">
						<p>
							<strong>Nota:</strong> Los resultados son estimaciones basadas en datos históricos y
							proyecciones. Las condiciones reales pueden variar.
						</p>
					</div>
				</div>
			</div>

			<div class="simulation-section">
				<MonteCarloAnalysis />
			</div>
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

	.content-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: 350px 1fr;
		position: relative;
		z-index: 10;
		animation: float 6s ease-in-out infinite;
		filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}
	}

	.info-card {
		background: var(--color--card-background);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: var(--card-shadow);
		border: 1px solid var(--color--border);
		transition: transform 0.3s ease;
		height: fit-content;
		position: sticky;
		top: 2rem;

		&:hover {
			transform: translateY(-2px);
		}

		h3 {
			font-family: var(--font--title);
			color: var(--color--text);
			margin-bottom: 1.5rem;
			font-size: 1.3rem;
			padding-left: 1rem;
			border-left: 4px solid var(--color--primary);
		}

		p {
			color: var(--color--text-shade);
			margin-bottom: 1.5rem;
			line-height: 1.6;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0 0 2rem 0;
			display: grid;
			gap: 1rem;

			li {
				color: var(--color--text-shade);
				padding-left: 1.5rem;
				position: relative;
				line-height: 1.6;

				&::before {
					content: '•';
					color: var(--color--primary);
					position: absolute;
					left: 0;
					font-weight: bold;
				}
			}
		}
	}

	.disclaimer {
		text-align: center;
		color: var(--color--text-shade);
		font-size: 0.9rem;
		padding: 1.5rem;
		background: var(--color--background);
		border-radius: 0.5rem;
		border: 1px solid var(--color--border);

		strong {
			color: var(--color--text);
		}
	}

	@keyframes float {
		0% {
			transform: translateY(-1rem);
		}
		50% {
			transform: translateY(-1.5rem);
		}
		100% {
			transform: translateY(-1rem);
		}
	}
</style>