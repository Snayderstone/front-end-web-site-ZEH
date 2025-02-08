<script lang="ts">
    import { onMount } from 'svelte';

    let currentSlide = 0;
    const intervalTime = 5000;
    let slideInterval: number;

    const slides = [
        {
            image: '/images/features/solar1.jpg',
            title: 'Constructora ZEH',
            description: 'Soluciones innovadoras para tus necesidades energénticas',
            button: 'Leer más',
            link: '/projects'
        },
        {
            image: '/images/features/solar2.jpg',
            title: 'Instalación de Paneles Solares',
            description: 'Transforma la luz del sol en energía para tu hogar',
            button: 'Descubrir más',
            link: '/services'
        },
        {
            image: '/images/features/solar3.jpg',
            title: 'Enegía Sostenible',
            description: 'contribuye a un futuro más limpio y verde.',
            button: 'Ver proyectos',
            link: '/sustainability'
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

<div class="slider">
    <button class="prev" on:click={prevSlide}>❮</button>
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
    <button class="next" on:click={nextSlide}>❯</button>
</div>

<style lang="scss">
    .slider {
        position: relative;
        width: 100%;
        height: 500px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
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
        transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
        display: flex;
        flex-direction: center;
        align-items: center;
    }

    .slide.active {
        opacity: 1;
        position: relative;
        visibility: visible;
    }

    .slide-content {
        text-align: center;
        color: var(--color--text-inverse);
        background-color: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border-radius: 8px;
    }

    .slide-content h2 {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .slide-content p {
        font-size: 1.2rem;
        margin-bottom: 20px;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--color--primary);
        color: var(--color--text-inverse);
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .button:hover {
        background-color: var(--color--primary-shade);
    }

    .prev,
    .next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: var(--color--text-inverse);
        border: none;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;
        z-index: 10;
    }

    .prev:hover,
    .next:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    .prev {
        left: 20px;
    }

    .next {
        right: 20px;
    }
</style>