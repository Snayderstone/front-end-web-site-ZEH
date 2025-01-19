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
    { nombre: "Refrigeradora", consumo: 1.2 },
    { nombre: "Bombillas LED", consumo: 0.01 },
    { nombre: "Lavadora", consumo: 0.5 },
    { nombre: "Secadora", consumo: 2.0 },
    { nombre: "Microondas", consumo: 0.9 },
    { nombre: "Computadora de escritorio", consumo: 0.2 },
    { nombre: "Cargador de teléfono", consumo: 0.01 }
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


  <form 
    class="simulation-form" 
    on:submit|preventDefault={handleSubmit}
    on:keydown={handleKeyDown}
  >
    <div class="sun-card card">
        <header class="simulation-header">
            <h2>Simulación del consumo de energía</h2>
          </header>
        <Sun />
    </div>

    <div class="cards-container">
      <!-- Tarjeta de Electrodomésticos -->
      <div class="card electrodomesticos-card">
        <div class="card-header">
          <h3>Electrodomésticos</h3>
          <div class="card-actions">
            <Button 
              color="secondary" 
              on:click={resetForm} 
              title="Restablecer formulario"
              type="button"
            >
              ↺
            </Button>
          </div>
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
        <span class="shortcut">(Ctrl + Enter)</span>
      </Button>
      </Sparkles>
    </div>
  </form>
</div>

<style lang="scss">
  .simulation-container {
    --card-bg: var(--color--card-background);
    --card-border: var(--color--border);
    --text-primary: var(--color--text);
    --text-secondary: var(--color--text-shade);
    --primary-color: var(--color--primary);
    --secondary-color: var(--color--secondary);
    --error-color: var(--color--error);
    --hover-bg: var(--color--hover);
    --input-bg: var(--color--input-background);
    
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
  }

  .simulation-header {
    text-align: center;
    margin-bottom: 2rem;

    h2 {
      color: var(--text-primary);
      font-family: var(--font--title);
      margin: 0;
      font-size: 2rem;
    }
  }

  .simulation-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .sun-card {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, var(--color--primary-light), var(--card-bg));
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(1fr);
    gap: 2rem;
    min-height: 600px;
  }

  .card {
    background: var(--card-bg);
    border-radius: 12px;
    box-shadow: var(--card-shadow);
    padding: 2rem;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h3 {
      color: var(--text-primary);
      font-family: var(--font--title);
      margin: 0;
      font-size: 1.5rem;
    }
  }

  .electrodomesticos-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 400px;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 0.5rem;
    margin-bottom: 1.5rem;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--input-bg);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 4px;
    }
  }

  .electrodomestico-item {
    display: grid;
    grid-template-columns: 1.5fr 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-radius: 8px;
    background: var(--input-bg);
    transition: all 0.2s ease;

    &:hover {
      background: var(--hover-bg);
    }
  }

  .submit-container {
    display: flex;
    justify-content: center;
    
    .shortcut {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      opacity: 0.8;
    }
  }

  .config-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .hint {
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      padding-right: 3rem;
    }

    .unit, .param {
      position: absolute;
      right: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      pointer-events: none;
    }
  }

  .consumption {
    max-width: 150px;
  }

  .arima-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    .input-group input {
      text-align: center;
      padding-right: 1.5rem;
    }

    .param {
      font-style: italic;
    }
  }

  input {
    padding: 0.75rem;
    border: 1px solid var(--card-border);
    border-radius: 6px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-family: var(--font--default);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
    }

    &:hover:not(:disabled) {
      border-color: var(--primary-color);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  @media (max-width: 1200px) {
    .cards-container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .simulation-container {
      padding: 1rem;
    }

    .card {
      padding: 1.5rem;
    }

    .electrodomestico-item {
      grid-template-columns: 1fr 1fr auto;
      padding: 0.75rem;
    }

    .shortcut {
      display: none;
    }
  }
</style> 