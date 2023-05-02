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
	const debug = ["straight", "swing"];
	const sections = copy.sections.filter((d) => debug.includes(d.id));
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
