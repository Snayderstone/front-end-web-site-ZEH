<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import Building from '$lib/components/atoms/Building.svelte';
	import GitHubIcons from '$lib/components/atoms/GitHubLink.svelte';

	export let showBackground = false;
</script>

<header class:has-background={showBackground}>
	<nav class="container">
		<a class="logo" href="/" aria-label="Site logo">
			<Logo />
		</a>

		<div class="links">
			<a href="/">Home</a>
		</div>

		<div class="links">
			<a href="/monte-carlo-model">MMC</a>
		</div>

		<div class="links">
			<a href="/lineal-programing">PL</a>
		</div>
		
		<div class="links">
			<a href="/nonlinear-programing">PNL</a>
		</div>

		<div class="links">
			<a href="/time-series">ST</a>
		</div>

		<div class="links">
			<a href="/prototype">Prototipo</a>
		</div>

		<div class="links">
			<a href="/blog">Blog</a>
		</div>

		<div class="links">
			<a href="/aboutUs">AboutUs</a>
		</div>


		<div class="links">
			<a href="/contactUs">ContactUs</a>
			<Building />
			<GitHubIcons />
			<ThemeToggle />
		

		</div>





	</nav>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	header {
		position: relative;
		padding: 30px 0;

		@include for-phone-only {
			padding: 20px 0;
		}

		&.has-background {
			background: linear-gradient(
				60deg,
				var(--color--waves-start) 0%,
				var(--color--waves-end) 100%
			);
		}

		.container {
			display: flex;
			align-items: center;
			gap: 30px;

			@include for-phone-only {
				.links {
					a {
						display: none;
					}
				}
			}
		}

		.logo {
			height: 44px;
			flex: 1;
		}

		a {
			color: var(--color--text);
		}

		.links {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 30px;

			a {
				text-decoration: none;

				&:hover {
					color: var(--color--primary);
					filter: drop-shadow(0px 0px 3px var(--color--primary));
				}
			}
		}
	}
</style>
