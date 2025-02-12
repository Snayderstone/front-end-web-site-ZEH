<script lang="ts">
    import type { CasaDoma } from './divices';
    import { devices } from './divices';
    
    export let medicion: CasaDoma;
  
    function formatDate(date: string) {
      const d = new Date(date);
      d.setHours(d.getHours()); // Ajuste horario UTC-5
      return d.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  
    $: totalConsumption = devices.reduce((acc, device) => {
      return acc + (medicion[device.field] ? device.consumption : 0);
    }, 0);
  
    $: activeDevices = devices.filter(device => medicion[device.field]).length;
  </script>
  
  <div class="card">
    <div class="timestamp-container">
      <div class="timestamp">
        <span class="timestamp-icon">🕒</span>
        <span class="timestamp-text">Última actualización: {formatDate(medicion.fecha_hora)}</span>
      </div>
    </div>

    <div class="card-header">
      <h3>Estado Actual de Dispositivos</h3>
      <div class="kpi-container">
        <div class="kpi">
          <span class="label">Consumo Total</span>
          <span class="value">{totalConsumption.toLocaleString()} W/s</span>
        </div>
        <div class="kpi">
          <span class="label">Dispositivos Activos</span>
          <span class="value">{activeDevices}/{devices.length}</span>
        </div>
      </div>
    </div>
  
    <div class="devices-grid">
      {#each devices as device}
        <div class="device-card" class:active={medicion[device.field]}>
          <div class="device-content">
            <span class="device-icon">{device.icon}</span>
            <div class="device-info">
              <span class="device-name">{device.name}</span>
              <span class="device-consumption">
                {#if medicion[device.field]}
                  <span class="consumption-active">⚡ {device.consumption} W/s</span>
                {:else}
                  <span class="consumption-inactive">💤 Inactivo</span>
                {/if}
              </span>
            </div>
          </div>
          <div class="status-wrapper">
            <div class="status-indicator"></div>
            <span class="status-text">{medicion[device.field] ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <style lang="scss">
    @import '$lib/scss/breakpoints.scss';
  
    .card {
      background: var(--color--card-background);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
    }
  
    .card-header {
      margin-bottom: 1.5rem;
  
      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        color: var(--color--text);
        
      }
    }
  
    .kpi-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
  
    .kpi {
      background: var(--color--background);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
  
      .label {
        display: block;
        font-size: 0.875rem;
        color: var(--color--text-shade);
        margin-bottom: 0.5rem;
      }
  
      .value {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color--primary);
      }
    }
  
    .devices-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  
    .device-card {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: var(--color--background);
      border-radius: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid var(--color--border);
  
      &:hover {
        transform: translateY(-2px);
      }
  
      &.active {
        background: linear-gradient(135deg, var(--color--success-background) 0%, var(--color--card-background) 100%);
        border-color: var(--color--success);
        box-shadow: 0 4px 20px rgba(var(--color--success-rgb), 0.15);
  
        .status-indicator {
          background: var(--color--success);
          box-shadow: 0 0 12px var(--color--success);
        }
  
        .status-text {
          color: var(--color--success);
        }
      }
    }
  
    .device-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  
    .device-icon {
      font-size: 1.75rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  
    .status-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
  
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color--error);
      transition: all 0.3s ease;
    }
  
    .status-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color--error);
    }
  
    .consumption-active {
      color: var(--color--success);
      font-weight: 500;
    }
  
    .consumption-inactive {
      color: var(--color--text-shade);
    }
  
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  
    .active .status-indicator {
      animation: pulse 2s infinite;
    }
  
    .timestamp-container {
      background: var(--color--background);
      margin: -1.5rem -1.5rem 1.5rem -1.5rem;
      padding: 1rem 1.5rem;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border-bottom: 1px solid var(--color--border);
    }
  
    .timestamp {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color--text-shade);
      font-size: 0.9rem;
  
      &-icon {
        font-size: 1.1rem;
      }
  
      &-text {
        font-weight: 500;
      }
    }
  </style>