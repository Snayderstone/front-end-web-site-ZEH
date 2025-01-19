<script lang="ts">
	import GitHubIcons from '$lib/icons/socials/github.svelte';
</script>

<a
	href="https://github.com/Snayderstone/web-site-ZEH"
	target="_blank"
	rel="noopener noreferrer"
	title="Recurso del proyecto"
>
	<GitHubIcons />
</a>

<style lang="scss">
	a {
		transition: all 0.2s ease-in-out;
		width: 24px;
		color: var(--color--text);
		fill: var(--color--text);

		&:hover {
			color: var(--color--primary);
			fill: var(--color--primary);
			filter: drop-shadow(0px 0px 3px var(--color--primary));
		}
	}
</style>
