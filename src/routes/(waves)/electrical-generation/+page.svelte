<script lang="ts">
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { supabase } from '$lib/components/supabase/supabaseClient';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import CurrentDataCard from '$lib/components/electricalgeneration/CurrentDataCard.svelte';
	import HistoricalDataCharts from '$lib/components/electricalgeneration/HistoricalDataCharts.svelte';
    import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
	export let data;
	let mediciones = data.mediciones;
	let subscription: RealtimeChannel;
	let lastMedicion = mediciones[0];

	onMount(() => {
		subscription = supabase
			.channel('privietfotonv-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'privietfotonv'
				},
				(payload) => {
					if (payload.eventType === 'INSERT') {
						mediciones = [payload.new, ...mediciones].slice(0, 100);
						lastMedicion = payload.new;
					}
				}
			)
			.subscribe();
	});

	onDestroy(() => {
		if (subscription) {
			supabase.removeChannel(subscription);
		}
	});
</script>

<div class="container">
	<ContentSection title="Monitor de Generación eléctrica en la Casa ZEH">
		<br>
		<br>
		<div class="dashboard-grid">

			 <SparklingHighlight>
			<div class="current-data-section">
				<CurrentDataCard medicion={lastMedicion} />
			</div>
		</SparklingHighlight>
			<div class="current-data-section">
				<HistoricalDataCharts mediciones={mediciones} />
			</div>
		</div>
	</ContentSection>
</div>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.container {
		max-width: var(--size-content-width);
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.dashboard-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: 1fr;
		position: relative;
		z-index: 10;
		transform: translateY(-2rem);
		animation: float 6s ease-in-out infinite;
		filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15));
		
		@include for-tablet-landscape-up {
			grid-template-columns: 350px 1fr;
		}

		@include for-tablet-portrait-down {
			transform: translateY(-1rem);
			padding: 0 1rem;
		}

		@include for-phone-only {
			transform: translateY(0);
		}
	}

	.current-data-section {
		position: relative;
		z-index: 2;
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
