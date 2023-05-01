<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import Intro from "$components/Scroll.svelte";
	import Straight from "$components/Straight.svelte";
	import { soundOn } from "$stores/misc.js";

	import copy from "$data/copy.json";

	const { hed, dek } = copy;

	let unlocked = false;

	const start = () => {
		$soundOn = true;
		unlocked = true;
	};

	// id to isolate to debug
	const debug = "straight";
</script>

<article>
	{#if !debug}
		<h1>{hed}</h1>
		<h2>{dek}</h2>

		<button on:click={start}>start</button>
		<button on:click={() => ($soundOn = !$soundOn)}
			>{$soundOn ? "sound off" : "sound on"}</button
		>
	{/if}

	{#if unlocked || debug}
		{#each copy.sections.filter((d) => d.id === debug) as { id, title, chunks }}
			<Section {id} {title} {chunks} />
		{/each}
	{/if}
</article>

<Footer />

<style>
	article {
		min-height: 100vh;
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		font-family: var(--mono);
	}
	summary {
		font-weight: bold;
	}
	summary:hover {
		cursor: pointer;
	}
	.nerd-box {
		background: var(--color-gray-100);
		padding: 2em;
	}
</style>
