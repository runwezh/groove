<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import Intro from "$components/Intro.svelte";
	import { soundOn } from "$stores/misc.js";

	import copy from "$data/copy.json";

	const { hed, dek } = copy;

	let unlocked = false;

	const start = () => {
		$soundOn = true;
		unlocked = true;
	};
</script>

<article>
	<h1>{hed}</h1>
	<h2>{dek}</h2>

	<button on:click={start}>start</button>
	<button on:click={() => ($soundOn = !$soundOn)}
		>{$soundOn ? "sound off" : "sound on"}</button
	>

	{#if unlocked}
		<Intro />
	{/if}

	<!-- {#each copy.sections as section}
		{#if section.id === "nerd-box"}
			<details class="nerd-box">
				<summary>{section.summary}</summary>
				<Section {...section} />
			</details>
		{:else}
			<Section {...section} />
		{/if}
	{/each} -->
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
