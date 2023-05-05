<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import Animation from "$components/Scroll.Animation.svelte";
	import { soundOn, started } from "$stores/misc.js";

	import copy from "$data/copy.json";
	import { onMount, tick } from "svelte";

	const { hed, dek, byline } = copy;

	let scrollyEl;

	const start = async () => {
		$started = true;
		await tick();
		// const el = document.getElementById("scroll-to-start");
		// el.scrollIntoView({ behavior: "smooth", block: "center" });
		scrollyEl.scrollIntoView({ block: "start", behavior: "smooth" });
	};

	const debug = [];
	// const sections = copy.sections.filter((d) => debug.includes(d.id));
	// $started = true;

	const sections = copy.sections;

	onMount(() => {
		scrollyEl = document.getElementById("scrolly");
	});
</script>

<article class:started={$started}>
	{#if debug.length === 0}
		<h1>{@html hed}</h1>
		<div class="dek">{dek.split(" ").slice(0, 4).join(" ")}</div>
		<div class="dek">{dek.split(" ").slice(4).join(" ")}</div>
		<div class="byline" style:margin-bottom="3em">{@html byline}</div>

		<button class="start" on:click={start} disabled={$started}>start</button>
		<button class="mute" on:click={() => ($soundOn = !$soundOn)}
			>{$soundOn ? "sound off" : "sound on"}</button
		>
	{/if}

	<Animation />
	<!-- {#each sections as { id, title, chunks }}
		<Section {id} {title} {chunks} />
	{/each} -->
</article>

<Footer />

<style>
	article {
		min-height: 100vh;
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		height: 100vh;
		overflow: hidden;
		font-size: var(--18px);
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
	h1 {
		font-family: var(--mono);
		font-size: 10em;
		color: var(--accent);
	}
	.dek,
	.byline {
		font-family: var(--mono);
		background: var(--accent);
		color: var(--color-black);
		width: fit-content;
		padding: 0.25em 0.5em;
	}
	button.start {
		font-size: 1.8em;
	}
</style>
