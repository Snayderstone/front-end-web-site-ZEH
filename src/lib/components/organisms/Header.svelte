<script lang="ts">
    import Logo from '$lib/components/atoms/Logo.svelte';
    import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
    import Building from '$lib/components/atoms/Building.svelte';
    import GitHubIcons from '$lib/components/atoms/GitHubLink.svelte';
    import { slide } from 'svelte/transition';

    export let showBackground = false;
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'; // Previene el scroll del body
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    function handleLinkClick() {
        isMenuOpen = false;
        document.body.style.overflow = 'auto';
    }

    // Añadir un manejador para cerrar el menú al redimensionar la ventana
    let mediaQuery;

    if (typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(min-width: 768px)');
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches && isMenuOpen) {
                isMenuOpen = false;
                document.body.style.overflow = 'auto';
            }
        });
    }

    interface PageLink {
        href: string;
        text: string;
        description: string;
        shortText?: string; // Para versión móvil
    }

    const navLinks: PageLink[] = [
        { href: '/', text: 'Home', description: 'Página de inicio del sitio' },
        { href: '/blog', text: 'Blog', description: 'El blog del sitio web' },
        { href: '/aboutUs', text: 'Nosotros', description: 'Información sobre el equipo detrás del proyecto' },
        { href: '/contactUs', text: 'Contacto', description: 'Formulario y enlaces de contacto' }
    ];

    const modelLinks: PageLink[] = [
        { href: '/monte-carlo-model', text: 'MMC', description: 'Simulador de análisis de inversión' },
        { href: '/lineal-programing', text: 'PL', description: 'Optimización del tamaño del panel solar y la batería' },
        { href: '/nonlinear-programing', text: 'PNL', description: 'Optimización de la orientación del panel solar' },
        { href: '/time-series', text: 'ST', description: 'Predicción del consumo energético de dispositivos' },
        { href: '/electrical-generation', text: 'Generación', description: 'Datos de generación solar de una casa ZEH' },
        { href: '/electrical-consumption', text: 'Consumo', description: 'Datos de consumo de una casa ZEH' }
    ];

    let selectedOption = modelLinks[0].href; // Opción seleccionada por defecto

    function navigateToOption() {
        if (selectedOption) {
            window.location.href = selectedOption;
        }
    }



</script>

<header class:has-background={showBackground}>
    <nav class="container">
        <a class="logo" href="/" aria-label="Site logo">
            <Logo />
        </a>

        <button class="menu-toggle" on:click={toggleMenu} aria-expanded={isMenuOpen}>
            <span class="hamburger" />
            <span class="sr-only">Menú</span>
        </button>

        <div 
            class="nav-content" 
            class:is-open={isMenuOpen}
            transition:slide={{duration: 300}}
        >
            <button class="close-menu" on:click={toggleMenu} aria-label="Cerrar menú">
                <span class="close-icon"></span>
            </button>
            <div class="nav-links">
                {#each navLinks as link}
                    <div class="nav-item">
                        <a href={link.href} class="nav-link "
                         on:click={handleLinkClick}>
                            {link.text}
                            <span class="tooltip">{link.description}</span>
                        </a>
                    </div>
                {/each}

            </div>

            <div class="nav-tools">
                <select bind:value={selectedOption} on:change={navigateToOption} class="combo-box">
                    {#each modelLinks as option}
                        <option value={option.href}>{option.text}</option>
                    {/each}
                </select>
                <Building />
                <GitHubIcons />
                <ThemeToggle />
            </div>

        </div>
    </nav>
</header>

<style lang="scss">
    @import '$lib/scss/breakpoints.scss';

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    header {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 1rem 0;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;

        &.has-background {
            background: linear-gradient(
                60deg,
                var(--color--waves-start) 0%,
                var(--color--waves-end) 100%
            );
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color--card-background); // Asegurar que el header tenga fondo
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
    }

    .logo {
        height: 44px;
        flex-shrink: 0;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }

    .nav-content {
        display: flex;
        align-items: center;
        gap: 2rem;
        flex: 1;
        justify-content: space-between;

        @include for-tablet-portrait-down {
            display: none;
            position: fixed; // Cambiado de absolute a fixed
            top: 0;
            left: 0;
            right: 0;
            height: 100vh; // Altura completa de la ventana
            background: var(--color--card-background);
            padding: 5rem 1rem 5rem; // Aumentamos el padding inferior
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid var(--color--border);
            flex-direction: column;
            justify-content: space-between; // Distribuye el espacio
            overflow-y: auto; // Añadir scroll vertical
            -webkit-overflow-scrolling: touch; // Mejor scroll en iOS
            z-index: 99; // Menor que el header para que quede debajo

            &.is-open {
                display: flex;
            }
        }
    }

    .nav-links {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem; // Reducido de 2rem

        @include for-tablet-portrait-down {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            padding: 0.5rem;
            gap: 0.5rem; // Espaciado reducido en móvil
            flex: 1;
            overflow-y: auto; // Permite scroll si hay muchos items
            padding-bottom: 2rem; // Espacio adicional al final de la lista
        }
    }

    .nav-item {
        position: relative;
        text-align: center;
        
        @include for-tablet-portrait-down {
            width: 100%;
            background: var(--color--background);
            border-radius: 0.5rem;
            
            &:active {
                transform: scale(0.98);
            }
        }

        &:hover .tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    }

    .tooltip {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: var(--color--card-background);
        color: var(--color--text);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;

        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 101;
        pointer-events: none;
        border: 1px solid var(--color--border);
        width: max-content;
        max-width: 300px;

        &::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: var(--color--card-background);
            border-left: 1px solid var(--color--border);
            border-top: 1px solid var(--color--border);
        }

        @include for-tablet-portrait-down {
            position: static;
            transform: none;
            opacity: 1;
            visibility: visible;
            margin-top: 0.25rem;
            font-size: 0.75rem;
            color: var(--color--text-shade);
            background: var(--color--background);
            box-shadow: none;
            border: 1px solid var(--color--border);
            padding: 0.25rem 0.5rem;
            text-align: center;
            border-radius: 0.25rem;

            &::before {
                display: none;
            }
        }
    }

    .nav-link {
        color: var(--color--text);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        padding: 0.5rem;
        border-radius: 0.5px;

        // Eliminamos el background hover para desktop
        &:hover {
            color: var(--color--primary);
        }

        // Resaltar la pestaña activa con fondo y subrayado
        &.active {
            font-weight: bold;
            color: var(--color--primary); /* Cambia el color del texto */
            border-bottom: 3px solid var(--color--primary); /* Agrega una línea de subrayado */
            background: rgba(255, 255, 255, 0.1); /* Fondo semi-transparente */
            padding: 0.5rem 1rem;
            border-radius: 5px;
        }


        // Mantenemos la línea inferior en hover solo para desktop
        @media (min-width: 768px) {
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background: var(--color--primary);
                transition: width 0.3s ease;
            }

            &:hover::after {
                width: 100%;
            }
        }

        @include for-tablet-portrait-down {
        display: flex;
        flex-direction: column; // Cambiado de row a column
        align-items: center;
        justify-content: center;
        padding: 0.75rem;
        gap: 0.5rem;

        // Mantenemos el background hover solo para móvil
        &:hover {
            background: var(--color--primary-tint);
        }

        // Estilos del tooltip en móvil
        .tooltip {
            font-size: 0.75rem;
            color: var(--color--text-shade);
            margin: 0;
            padding: 0;
            border: none;
            background: none;
            box-shadow: none;
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            max-width: none;
            width: 100%; // Cambiado de auto a 100%
            text-align: center; // Centrar el texto
            
            &::before {
                display: none;
            }
        }
    }
    }

    .nav-tools {
        display: flex;
        align-items: center;
        gap: 1rem;

        @include for-tablet-portrait-down {
            width: 100%;
            justify-content: center;
            padding: 1rem;
            margin-top: 0rem; // Añadimos margen superior
            margin-bottom: 0rem; // Añadimos margen inferior significativo
            border-top: 1px solid var(--color--border);
            background: var(--color--card-background);
            position: sticky; // Hacemos que se mantenga visible
            bottom: 0;
            z-index: 2;
        }
    }

    .menu-toggle {
        display: none;
        padding: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;

        @include for-tablet-portrait-down {
            display: block;
        }

        .hamburger {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--color--text);
            position: relative;
            transition: all 0.3s ease;

            &::before,
            &::after {
                content: '';
                position: absolute;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--color--text);
                transition: all 0.3s ease;
            }

            &::before {
                top: -8px;
            }

            &::after {
                bottom: -8px;
            }
        }

        &[aria-expanded="true"] {
            .hamburger {
                transform: rotate(45deg);

                &::before {
                    top: 0;
                    transform: rotate(0);
                }

                &::after {
                    bottom: 0;
                    transform: rotate(-90deg);
                }
            }
        }
    }

    .close-menu {
        display: none;
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 100;

        @include for-tablet-portrait-down {
            display: block;
        }

        .close-icon {
            display: block;
            width: 24px;
            height: 24px;
            position: relative;

            &::before,
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--color--text);
                transform-origin: center;
            }

            &::before {
                transform: rotate(45deg);
            }

            &::after {
                transform: rotate(-45deg);
            }
        }

        &:hover {
            .close-icon {
                &::before,
                &::after {
                    background: var(--color--primary);
                }
            }
        }
    }

    .combo-box {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid var(--color--border);
        border-radius: 5px;
        background: var(--color--card-background);
        color: var(--color--text);
        cursor: pointer;
        margin-left: auto;
    }

    .combo-box:focus {
        outline: none;
        border-color: var(--color--primary);
    }


</style>