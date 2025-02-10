<script lang="ts">
  import type { ConfiguracionSimulacion, Electrodomestico } from './ElectricConsumption';
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import Sun from '$lib/components/timeseries/Sun.svelte';
  import { tick } from 'svelte';
  import Sparkles from '$lib/components/atoms/Sparkles.svelte';

  const dispatch = createEventDispatcher<{
    submit: ConfiguracionSimulacion;
    change: ConfiguracionSimulacion;
  }>();

// Valores por defecto y validaciones
const DEFAULTS = {
  dias_historicos: 30,
  orden_p: 5,
  orden_d: 1,
  orden_q: 0,
  intervalo_confianza: 0.95,
  electrodomesticos_default: [
    { nombre: "Aire acondicionado", consumo: 1.5 },
    { nombre: "Televisor", consumo: 0.1 },
    { nombre: "Refrigeradora", consumo: 1.2 }
  ]
};

  const VALIDATIONS = {
    min_dias: 1,
    max_dias: 30,
    min_orden: 0,
    max_orden: 10,
    min_intervalo: 0,
    max_intervalo: 1
  };

  // Estado del formulario
  let electrodomesticos: Electrodomestico[] = [...DEFAULTS.electrodomesticos_default];
  let dias_historicos = DEFAULTS.dias_historicos;
  let orden_p = DEFAULTS.orden_p;
  let orden_d = DEFAULTS.orden_d;
  let orden_q = DEFAULTS.orden_q;
  let intervalo_confianza = DEFAULTS.intervalo_confianza;
  let formValid = true;

  // Función para validar el formulario
  $: {
    formValid = electrodomesticos.length > 0 &&
      electrodomesticos.every(e => e.nombre && e.consumo > 0) &&
      dias_historicos >= VALIDATIONS.min_dias &&
      dias_historicos <= VALIDATIONS.max_dias &&
      orden_p >= VALIDATIONS.min_orden &&
      orden_p <= VALIDATIONS.max_orden &&
      orden_d >= VALIDATIONS.min_orden &&
      orden_d <= VALIDATIONS.max_orden &&
      orden_q >= VALIDATIONS.min_orden &&
      orden_q <= VALIDATIONS.max_orden &&
      intervalo_confianza >= VALIDATIONS.min_intervalo &&
      intervalo_confianza <= VALIDATIONS.max_intervalo;
  }

  // Función para notificar cambios
  function notifyChange() {
    const config: ConfiguracionSimulacion = {
      electrodomesticos: Object.fromEntries(
        electrodomesticos
          .filter(e => e.nombre && e.consumo)
          .map(e => [e.nombre, e.consumo])
      ),
      dias_historicos,
      orden_arima: [orden_p, orden_d, orden_q],
      intervalo_confianza
    };
    
    dispatch('change', config);
  }

  async function agregarElectrodomestico() {
    electrodomesticos = [...electrodomesticos, { nombre: "", consumo: 0 }];
    await tick();
    const lastInput = document.querySelector('.electrodomesticos-list input:last-of-type');
    if (lastInput) {
      (lastInput as HTMLInputElement).focus();
    }
  }

  function eliminarElectrodomestico(index: number) {
    electrodomesticos = electrodomesticos.filter((_, i) => i !== index);
    notifyChange();
  }

  function handleSubmit() {
    if (!formValid) return;

    const config: ConfiguracionSimulacion = {
      electrodomesticos: Object.fromEntries(
        electrodomesticos
          .filter(e => e.nombre && e.consumo)
          .map(e => [e.nombre, e.consumo])
      ),
      dias_historicos,
      orden_arima: [orden_p, orden_d, orden_q],
      intervalo_confianza
    };
    
    dispatch('submit', config);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmit();
    }
  }

  function resetForm() {
    electrodomesticos = [...DEFAULTS.electrodomesticos_default];
    dias_historicos = DEFAULTS.dias_historicos;
    orden_p = DEFAULTS.orden_p;
    orden_d = DEFAULTS.orden_d;
    orden_q = DEFAULTS.orden_q;
    intervalo_confianza = DEFAULTS.intervalo_confianza;
    notifyChange();
  }
</script>

<div class="simulation-container">
  <form class="simulation-form" on:submit|preventDefault={handleSubmit} on:keydown={handleKeyDown}>
    <div class="sun-card card">
      <Sun />
    </div>

    <div class="form-grid">
      <!-- Tarjeta de Electrodomésticos -->
      <div class="card electrodomesticos-card">
        <div class="card-header">
          <h3>Electrodomésticos</h3>
          <Button color="secondary" on:click={resetForm} title="Restablecer formulario" type="button">
            <span class="icon">↺</span>
          </Button>
        </div>

        <div class="electrodomesticos-list">
          {#each electrodomesticos as electrodomestico, i (i)}
            <div class="electrodomestico-item">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Nombre del electrodoméstico"
                  bind:value={electrodomestico.nombre}
                  on:input={notifyChange}
                  required
                />
              </div>
              <div class="input-group consumption">
                <input
                  type="number"
                  placeholder="Consumo"
                  bind:value={electrodomestico.consumo}
                  min="0"
                  step="0.01"
                  on:input={notifyChange}
                  required
                />
                <span class="unit">kWh</span>
              </div>
              <Button 
                color="primary"
                on:click={() => eliminarElectrodomestico(i)}
                title="Eliminar electrodoméstico"
                type="button"
              >
                ✕
              </Button>
            </div>
          {/each}
        </div>
        <Sparkles>
        <Button 
          color="secondary"
          
          on:click={agregarElectrodomestico}
          type="button"
        >
          + Agregar electrodoméstico
        </Button>
        </Sparkles>
      </div>

      <!-- Tarjeta de Configuración -->
      <div class="card config-card">
        <h3>Configuración de simulación</h3>
        
        <div class="config-content">
          <div class="form-group">
            <label for="dias">Días históricos</label>
            <div class="input-group">
              <input
                id="dias"
                type="number"
                bind:value={dias_historicos}
                min={VALIDATIONS.min_dias}
                max={VALIDATIONS.max_dias}
                on:input={notifyChange}
                required
              />
              <span class="hint">({VALIDATIONS.min_dias}-{VALIDATIONS.max_dias} días)</span>
            </div>
          </div>

          <div class="form-group">
            <label for="arima-group">Orden ARIMA (p,d,q)</label>
            <div id="arima-group" class="arima-inputs" role="group">
              <div class="input-group">
                <input
                  id="arima_p"
                  type="number"
                  bind:value={orden_p}
                  min={VALIDATIONS.min_orden}
                  max={VALIDATIONS.max_orden}
                  on:input={notifyChange}
                  required
                  aria-label="Orden ARIMA p"
                />
                <span class="param">p</span>
              </div>
              <div class="input-group">
                <input
                  id="arima_d"
                  type="number"
                  bind:value={orden_d}
                  min={VALIDATIONS.min_orden}
                  max={VALIDATIONS.max_orden}
                  on:input={notifyChange}
                  required
                  aria-label="Orden ARIMA d"
                />
                <span class="param">d</span>
              </div>
              <div class="input-group">
                <input
                  id="arima_q"
                  type="number"
                  bind:value={orden_q}
                  min={VALIDATIONS.min_orden}
                  max={VALIDATIONS.max_orden}
                  on:input={notifyChange}
                  required
                  aria-label="Orden ARIMA q"
                />
                <span class="param">q</span>
              </div>
            </div>
            <span class="hint">Valores entre {VALIDATIONS.min_orden} y {VALIDATIONS.max_orden}</span>
          </div>

          <div class="form-group">
            <label for="intervalo">Intervalo de confianza</label>
            <div class="input-group">
              <input
                id="intervalo"
                type="number"
                bind:value={intervalo_confianza}
                min={VALIDATIONS.min_intervalo}
                max={VALIDATIONS.max_intervalo}
                step="0.01"
                on:input={notifyChange}
                required
              />
              <span class="unit">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-container">
        <Sparkles>
        <Button 
       type="submit" color="primary"
        disabled={!formValid}
        title={!formValid ? 'Por favor, complete todos los campos correctamente' : 'Iniciar simulación'}
      >
        Iniciar simulación
        <span class="shortcut" aria-hidden="true">(Ctrl + Enter)</span>
      </Button>
      </Sparkles>
    </div>
  </form>
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .simulation-container {
    --card-padding: clamp(1rem, 2vw, 2rem);
    --input-height: 2.5rem;
    --border-radius: 0.75rem;
    
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--card-padding);

    @include for-phone-only {
      padding: 0.5rem;
    }
  }

  .simulation-form {
    display: grid;
    gap: clamp(1rem, 3vw, 2rem);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 600px), 1fr));
    gap: clamp(1rem, 3vw, 2rem);
  }

  .card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
    padding: var(--card-padding);
    height: 100%;
    border: 1px solid var(--card-border);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-shadow-hover);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--card-border);

      h3 {
        font-size: clamp(1.25rem, 2vw, 1.5rem);
        font-weight: 600;
        color: var(--text-primary);
      }
    }
  }

  .electrodomesticos-list {
    display: grid;
    gap: 1rem;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--input-bg);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--input-bg);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 3px;
    }
  }

  .electrodomestico-item {
    display: grid;
    grid-template-columns: minmax(150px, 1.5fr) minmax(100px, 1fr) auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem;
    border-radius: calc(var(--border-radius) * 0.5);
    background: var(--input-bg);
    transition: all 0.2s ease;

    @include for-phone-only {
      grid-template-columns: 1fr auto;
      grid-template-areas: 
        "nombre borrar"
        "consumo borrar";
      gap: 0.5rem;

      .input-group:first-child {
        grid-area: nombre;
      }
      .input-group.consumption {
        grid-area: consumo;
      }
    }
  }

  .input-group {
    position: relative;
    
    input {
      width: 100%;
      height: var(--input-height);
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--card-border);
      border-radius: calc(var(--border-radius) * 0.5);
      background: var(--input-bg);
      color: var(--text-primary);
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
      }

      &:hover:not(:disabled) {
        border-color: var(--primary-color);
      }
    }

    .unit, .param {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      font-size: 0.875rem;
      pointer-events: none;
    }
  }

  .config-content {
    display: grid;
    gap: 1.5rem;
  }

  .arima-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @include for-phone-only {
      gap: 0.5rem;
    }
  }

  .submit-container {
    display: flex;
    justify-content: center;
    padding: 1rem 0;

    .shortcut {
      @include for-phone-only {
        display: none;
      }
    }
  }
</style>