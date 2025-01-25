<script lang="ts">
  import { fade } from 'svelte/transition';
  import BatteryCharts from './BatteryCharts.svelte';
  import SolarCharts from './SolarCharts.svelte';
  import EnvironmentCharts from './EnvironmentCharts.svelte';

  export let mediciones: any[] = [];
</script>

<div class="charts-container" in:fade={{ duration: 300 }}>
  <div class="charts-grid">
    <div class="charts-row battery-charts" in:fade={{ duration: 300, delay: 100 }}>
      <BatteryCharts {mediciones} />
    </div>
    <div class="charts-row solar-charts" in:fade={{ duration: 300, delay: 200 }}>
      <SolarCharts {mediciones} />
    </div>
    <div class="charts-row environment-charts" in:fade={{ duration: 300, delay: 300 }}>
      <EnvironmentCharts {mediciones} />
    </div>
  </div>
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .charts-container {
    width: 100%;
  }

  .charts-grid {
    display: grid;
    gap: 2rem;
  }

  .charts-row {
    background: var(--color--card-background);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .battery-charts {
    border-left: 4px solid #4ade80;
  }

  .solar-charts {
    border-left: 4px solid #60a5fa;
  }

  .environment-charts {
    border-left: 4px solid #f59e0b;
  }
</style> 