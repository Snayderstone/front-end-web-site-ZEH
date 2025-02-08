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
                <a href="/" class="nav-link" on:click={handleLinkClick}>Home</a>
                <a href="/monte-carlo-model" class="nav-link" on:click={handleLinkClick}>MMC</a>
                <a href="/lineal-programing" class="nav-link" on:click={handleLinkClick}>PL</a>
                <a href="/nonlinear-programing" class="nav-link" on:click={handleLinkClick}>PNL</a>
                <a href="/time-series" class="nav-link" on:click={handleLinkClick}>ST</a>
                <a href="/prototype" class="nav-link" on:click={handleLinkClick}>Prototipo</a>
                <a href="/blog" class="nav-link" on:click={handleLinkClick}>Blog</a>
                <a href="/aboutUs" class="nav-link" on:click={handleLinkClick}>AboutUs</a>
                <a href="/contactUs" class="nav-link" on:click={handleLinkClick}>ContactUs</a>
            </div>

            <div class="nav-tools">
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
            padding: 5rem 1rem 1rem; // Padding superior aumentado para no tapar el header
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid var(--color--border);
            flex-direction: column;
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
        align-items: center;
        gap: 2rem;

        @include for-tablet-portrait-down {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
        }
    }

    .nav-link {
        color: var(--color--text);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        padding: 0.5rem 0;

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

        &:hover {
            color: var(--color--primary);

            &::after {
                width: 100%;
            }
        }

        @include for-tablet-portrait-down {
            display: block;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;

            &:hover {
                background: var(--color--primary-tint);
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
            margin-top: auto; // Empuja los botones hacia abajo
            border-top: 1px solid var(--color--border);
            background: var(--color--card-background);
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
</style>