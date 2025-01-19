<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  export let width = '100%';
  export let height = '300px';
  export let showEffects = true;
  export let panelSize = 12;
</script>

<div class="visualization-container" style="width: {width}; height: {height};">
  <div 
    class="visualization-card"
    in:fade={{ duration: 300 }}
  >
    <h3>Panel Solar</h3>
    <div class="panel-container" in:fly={{ y: 20, duration: 600 }}>
      <div class="panel-main">
        <div class="panel-front">
          <div class="panel-grid">
            {#each Array(panelSize) as _}
              <div class="panel-cell" />
            {/each}
          </div>
        </div>
        <div class="panel-side" />
        <div class="panel-top" />
      </div>

      {#if showEffects}
        <div class="sun-reflection" />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .visualization-container {
    padding: 1rem;
  }

  .visualization-card {
    background: var(--color--card-background);
    
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--color--border);
    
    h3 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: var(--color--text);
      font-family: var(--font--title);
    }
  }

  .panel-container {
    position: relative;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1000px;
  }

  .panel-main {
    position: relative;
    width: 12rem;
    height: 8rem;
    transform-style: preserve-3d;
    transform: rotateX(20deg) rotateY(-30deg);
    transition: transform 0.5s ease;

    &:hover {
      transform: rotateX(25deg) rotateY(-25deg);
    }
  }

  .panel-front {
    position: absolute;
    inset: 0;
    background-color: #1e293b;
    border: 2px solid var(--color--border);
    border-radius: 0.5rem;
    transform-style: preserve-3d;
  }

  .panel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.35rem;
    padding: 0.35rem;
    height: 100%;
  }

  .panel-cell {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    border-radius: 0.125rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
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
    20%, 100% {
      transform: translateX(100%);
    }
  }
</style>