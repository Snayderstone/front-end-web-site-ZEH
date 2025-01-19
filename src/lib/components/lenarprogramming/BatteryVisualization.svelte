<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  
  export let width = '100%';
  export let height = '300px';
  export let chargeLevel = 70;
  export let isCharging = true;

  // Animación del nivel de carga
  const batteryLevel = tweened(0, {
    duration: 1500,
    easing: cubicOut
  });

  // Actualizar el nivel cuando cambie chargeLevel
  $: batteryLevel.set(chargeLevel);

  // Color de la batería según el nivel
  $: batteryColor = $batteryLevel > 60 
    ? ['#4ade80', '#22c55e']  // Verde
    : $batteryLevel > 30 
      ? ['#fbbf24', '#d97706'] // Amarillo
      : ['#ef4444', '#dc2626']; // Rojo
</script>

<div class="visualization-container" style="width: {width}; height: {height};">
  <div 
    class="visualization-card"
    in:fade={{ duration: 300 }}
  >
    <h3 class="percentage" >Batería: {Math.round($batteryLevel)}%   {#if isCharging}
      <span class="charging-icon">⚡</span>
    {/if}</h3>
    
    <div class="battery-container" in:fly={{ y: 20, duration: 600 }}>
      <div class="battery">
        <div class="battery-head" />
        <div class="battery-body">
          <div 
            class="battery-level" 
            style="
              height: {$batteryLevel}%;
              background: linear-gradient(180deg, {batteryColor[0]} 0%, {batteryColor[1]} 100%);
            "
          >
            {#if isCharging}
              <div class="charging-waves">
                {#each Array(3) as _, i}
                  <div class="wave" style="animation-delay: {i * 0.2}s"/>
                {/each}
              </div>
            {/if}
          </div>
          <div class="battery-cells">
            {#each Array(3) as _}
              <div class="battery-cell" />
            {/each}
          </div>
        </div>
      </div>

      
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

  .battery-container {
    position: relative;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .battery {
    position: relative;
    width: 10rem;
    height: 15rem;
  }

  .battery-head {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 3rem;
    height: 1rem;
    background: var(--color--text);
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .battery-body {
    position: relative;
    height: 100%;
    background: #1e293b;
    border: 2px solid var(--color--border);
    border-radius: 1rem;
    overflow: hidden;
  }

  .battery-level {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: height 1s ease, background 0.5s ease;
  }

  .charging-waves {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 100%
    );
    animation: wave 2s ease-in-out infinite;
    transform-origin: bottom;
  }

  .battery-cells {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0.5rem;
    pointer-events: none;
  }

  .battery-cell {
    width: 100%;
    height: 2px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1px;
  }


    .percentage {
      font-size: 1.2rem;
    }

    .charging-icon {
      animation: pulse 1s ease-in-out infinite;
    }


  @keyframes wave {
    0% {
      transform: scaleY(0);
      opacity: 0;
    }
    50% {
      transform: scaleY(1);
      opacity: 1;
    }
    100% {
      transform: scaleY(0);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
</style>