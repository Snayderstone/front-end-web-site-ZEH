<script lang="ts">
    import { onMount } from 'svelte';

    let currentSlide = 0;
    const intervalTime = 5000;
    let slideInterval: ReturnType<typeof setInterval>;

    const slides = [
        {
            image: '/images/features/solar1.jpg',
            title: 'Constructora ZEH',
            description: 'Soluciones innovadoras para tus necesidades energénticas',
            button: 'Leer más',
            link: '/abaoutUs'
        },
        {
            image: '/images/features/solar2.jpg',
            title: 'Instalación de Paneles Solares',
            description: 'Transforma la luz del sol en energía para tu hogar',
            button: 'Descubrir más',
            link: '/abaoutUs'
        },
        {
            image: '/images/features/solar3.jpg',
            title: 'Enegía Sostenible',
            description: 'contribuye a un futuro más limpio y verde.',
            button: 'Ver proyectos',
            link: '/abaoutUs'
        }
    ];

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    onMount(() => {
        slideInterval = setInterval(nextSlide, intervalTime);
        return () => clearInterval(slideInterval);
    });
</script>

<div class="slider-wrapper">
    <div class="slider">
        <button class="prev" on:click={prevSlide} aria-label="Anterior">❮</button>
        {#each slides as slide, index}
            <div
                class="slide {index === currentSlide ? 'active' : ''}"
                style="background-image: url({slide.image});"
            >
                <div class="slide-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.description}</p>
                    <a href={slide.link} class="button">{slide.button}</a>
                </div>
            </div>
        {/each}
        <button class="next" on:click={nextSlide} aria-label="Siguiente">❯</button>
    </div>
</div>

<style lang="scss">
    @import '$lib/scss/breakpoints.scss';

    .slider-wrapper {
        margin-bottom: 4rem;
        background: var(--color--card-background);
        border-radius: 2rem;
        padding: 0.5rem;
        box-shadow: var(--card-shadow);
        border: 1px solid var(--color--border);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: var(--card-shadow-hover);
            transform: translateY(-2px);
        }

        @include for-phone-only {
            margin-bottom: 2rem;
            padding: 0.5rem;
        }
    }

    .slider {
        position: relative;
        width: 100%;
        height: 500px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1.5rem;

        @include for-phone-only {
            height: 300px;
        }
    }

    .slide {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        align-items: center;
        justify-content: center;
        position: absolute;
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .slide.active {
        opacity: 1;
        position: relative;
        visibility: visible;
    }

    .slide-content {
        text-align: center;
        color: #ffffff; // Color fijo blanco para el contenido
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.6)
        );
        padding: 2rem;
        border-radius: 1rem;
        backdrop-filter: blur(8px);
        max-width: 80%;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

        @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
            background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.6),
                rgba(0, 0, 0, 0.4)
            );
            backdrop-filter: blur(12px);
        }

        &:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @include for-phone-only {
            padding: 1.5rem;
            max-width: 95%;
        }

        h2 {
            font-family: var(--font--title);
            font-size: 2.5rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            color: #ffffff;
            letter-spacing: -0.5px;

            @include for-phone-only {
                font-size: 1.8rem;
            }
        }

        p {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
            color: #ffffff;
            opacity: 0.9;
            line-height: 1.6;

            @include for-phone-only {
                font-size: 1rem;
            }
        }
    }

    .button {
        display: inline-block;
        padding: 0.75rem 2rem;
        background-color: var(--color--primary);
        color: #ffffff;
        text-decoration: none;
        border-radius: 2rem;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                120deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transform: translateX(-100%);
            transition: 0.6s;
        }

        &:hover {
            background-color: var(--color--primary-shade);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(var(--color--primary-rgb), 0.4);

            &::before {
                transform: translateX(100%);
            }
        }

        &:active {
            transform: translateY(0);
        }
    }

    .prev,
    .next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: var(--color--card-background);
        color: var(--color--text);
        border: 1px solid var(--color--border);
        font-size: 1.5rem;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.3s ease;
        z-index: 10;
        opacity: 0.8;

        &:hover {
            opacity: 1;
            background: var(--color--primary);
            color: var(--color--text-inverse);
            border-color: var(--color--primary);
            box-shadow: var(--card-shadow);
        }

        @include for-phone-only {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.2rem;
        }
    }

    .prev {
        left: 1rem;
    }

    .next {
        right: 1rem;
    }
</style>