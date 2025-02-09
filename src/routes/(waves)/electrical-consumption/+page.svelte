<script lang="ts">
  import ContentSection from '$lib/components/organisms/ContentSection.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '$lib/components/supabase/supabaseClient';
  import ConsumptionDataCard from '$lib/components/electricalconsumption/ConsumptionDataCard.svelte';
  import ConsumptionCharts from '$lib/components/electricalconsumption/ConsumptionCharts.svelte';
  import SparklingHighlight from '$lib/components/molecules/SparklingHighlight.svelte';
  import DeviceAnalysisChart from '$lib/components/electricalconsumption/DeviceAnalysisChart.svelte';
  import type { RealtimeChannel } from '@supabase/supabase-js';

  export let data;
  let casaDoma = data.casaDoma;
  let lastMedicion = casaDoma[0];
  let subscription: RealtimeChannel;

  onMount(() => {
    subscription = supabase
      .channel('casa-doma-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'casa_doma'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            casaDoma = [payload.new, ...casaDoma].slice(0, 100);
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
  <ContentSection title="Monitor de Consumo Eléctrico en la Casa ZEH">
    <br>
    <br>
    <br>
    <div class="dashboard-layout">
      <!-- Panel izquierdo con tarjetas de dispositivos -->
      <div class="side-panel">
        <SparklingHighlight>
          <div class="current-data-section">
            <ConsumptionDataCard medicion={lastMedicion} />
          </div>
        </SparklingHighlight>
      </div>

      <!-- Panel derecho con gráficas -->
      <div class="charts-panel">
        <div class="chart-section">
          <ConsumptionCharts mediciones={casaDoma} />
        </div>
        <div class="analysis-section">
          <DeviceAnalysisChart mediciones={casaDoma} />
        </div>
      </div>
    </div>
  </ContentSection>
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .container {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 1rem;

    @include for-phone-only {
      padding: 0.5rem;
    }
  }

  .dashboard-layout {
    display: grid;
    gap: 2rem;
    grid-template-columns: minmax(400px, 1fr) minmax(600px, 2fr);
    position: relative;
    z-index: 10;
    
    @include for-tablet-portrait-down {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      transform: none; // Eliminamos la animación en tablets
    }

    @include for-phone-only {
      gap: 1rem;
    }
  }

  .side-panel {
    position: sticky;
    top: 2rem;
    height: fit-content;

    @include for-tablet-portrait-down {
      position: static; // Desactivamos sticky en tablets
    }
  }

  .charts-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @include for-phone-only {
      gap: 1rem;
    }
  }

  .current-data-section {
    position: relative;
    z-index: 2;
    height: auto; // Cambiado de 100% a auto
    display: flex;
    flex-direction: column;
  }

  .chart-section {
    position: relative;
    z-index: 2;
    min-height: 400px; // Altura mínima fija
    height: auto; // Cambiado de 100% a auto
    width: 100%;

    @include for-tablet-portrait-down {
      min-height: 350px; // Reducimos altura en tablets
    }

    @include for-phone-only {
      min-height: 300px; // Reducimos más en móviles
    }
  }

  .analysis-section {
    width: 100%;
    margin-top: 0; // Eliminado el margen superior

    @include for-phone-only {
      overflow-x: auto; // Permitimos scroll horizontal si es necesario
      padding-bottom: 1rem; // Espacio para el scroll
    }
  }

  // Ajustamos la animación solo para desktop
  @media (min-width: 768px) {
    .dashboard-layout {
      transform: translateY(-2rem);
      animation: float 6s ease-in-out infinite;
    }
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