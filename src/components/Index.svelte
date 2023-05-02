<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { soundOn } from "$stores/misc.js";

	import copy from "$data/copy.json";

	const { hed, dek } = copy;

	let unlocked = false;

	const start = () => {
		$soundOn = true;
		unlocked = true;
	};

	// id to isolate to debug
	const debug = [];
	//const sections = copy.sections.filter((d) => debug.includes(d.id));
	const sections = copy.sections;
</script>

<article>
	{#if debug.length === 0}
		<h1>{hed}</h1>
		<h2>{dek}</h2>

		<button on:click={start}>start</button>
		<button on:click={() => ($soundOn = !$soundOn)}
			>{$soundOn ? "sound off" : "sound on"}</button
		>
	{/if}

	{#if unlocked || debug.length > 0}
		{#each sections as { id, title, chunks }}
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
		font-family: var(--sans);
	}
</style>
