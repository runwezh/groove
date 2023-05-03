<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { soundOn, started } from "$stores/misc.js";

	import copy from "$data/copy.json";

	const { hed, dek, byline } = copy;

	const start = () => {
		$started = true;
	};

	// id to isolate to debug
	const debug = ["straight"];
	const sections = copy.sections.filter((d) => debug.includes(d.id));
	$started = true;
	//const sections = copy.sections;
</script>

<article class:started={$started}>
	{#if debug.length === 0}
		<h1>{@html hed}</h1>
		<h2>{@html dek}</h2>
		<div class="byline" style:margin-bottom="3em">{@html byline}</div>

		<button on:click={start}>start</button>
		<button class="mute" on:click={() => ($soundOn = !$soundOn)}
			>{$soundOn ? "sound off" : "sound on"}</button
		>
	{/if}

	{#each sections as { id, title, chunks }}
		<Section {id} {title} {chunks} />
	{/each}
</article>

<Footer />

<style>
	article {
		min-height: 100vh;
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		font-family: var(--sans);
		height: 100vh;
		overflow: hidden;
	}
	article.started {
		height: auto;
		overflow: visible;
	}
	.mute {
		position: fixed;
		top: 1em;
		right: 1em;
	}
	:global(.byline a) {
		color: white;
	}
</style>
