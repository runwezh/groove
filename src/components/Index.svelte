<script>
	import Landing from "$components/Landing.svelte";
	import IntroAnimation from "$components/IntroAnimation.svelte";
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { started } from "$stores/misc.js";
	import copy from "$data/copy.json";

	const debug = [];
	// const sections = copy.sections.filter((d) => debug.includes(d.id));
	// $started = true;

	const sections = copy.sections;
</script>

<IntroAnimation />

<article class:started={$started}>
	{#if debug.length === 0}
		<Landing />
	{/if}

	<div class="sections" class:started={$started}>
		{#each sections as { id, title, chunks }}
			{#if id === "bonus"}
				<details>
					<summary>{title}</summary>
					<Section {id} {chunks} />
				</details>
			{:else if id === "notes"}
				<iframe
					style="border-radius:12px"
					src="https://open.spotify.com/embed/playlist/2lv10HmmIbXoknNEoNDt2s?utm_source=generator&theme=0"
					width="100%"
					height="352"
					frameBorder="0"
					allowfullscreen=""
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
					title="playlist of songs with wonky grooves"
				/>
				<Section {id} {title} {chunks} />
			{:else}
				<Section {id} {title} {chunks} />
			{/if}
		{/each}
	</div>
</article>

<Footer />

<style>
	article {
		height: calc(100vh - 78.92px);
		overflow: hidden;
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		font-size: var(--18px);
	}
	article.started {
		height: auto;
		overflow: visible;
	}
	.sections {
		visibility: hidden;
	}
	.sections.started {
		visibility: visible;
	}
	details {
		background: var(--color-gray-800);
		border: 3px solid var(--accent);
		padding: 2em;
	}
	summary {
		font-weight: bold;
	}
	summary:hover {
		cursor: pointer;
	}
	summary::marker {
		color: var(--accent);
	}
</style>
