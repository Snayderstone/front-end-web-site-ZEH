<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import RecentPosts from '$lib/components/organisms/RecentPosts.svelte';
	import Features from '$lib/components/organisms/Features.svelte';
	import type { Feature, BlogPost } from '$lib/utils/types';
	import Slider from '$lib/components/organisms/Slider.svelte';
	

	export let data: {
		features: Feature[];
		posts: BlogPost[];
	};

	let { features, posts } = data;
</script>

<div class="container">
	
	<Hero />
	<Slider />
	<About />
	{#if posts && posts.length > 0}
		<RecentPosts {posts} />
	{/if}
	<Features {features} />
</div>
