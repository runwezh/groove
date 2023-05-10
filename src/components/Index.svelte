<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { soundOn, started } from "$stores/misc.js";
	import copy from "$data/copy.json";
	import { onMount, tick } from "svelte";

	const { hed, dek, byline } = copy;

	let startEl;

	const start = async () => {
		$started = true;
		await tick();
		startEl.scrollIntoView({ block: "center", behavior: "smooth" });
	};

	const debug = ["dilla"];
	const sections = copy.sections.filter((d) => debug.includes(d.id));
	$started = true;

	// const sections = copy.sections;

	onMount(() => {
		startEl = document.getElementById("start-of-story");
	});
</script>

<article class:started={$started}>
	{#if debug.length === 0}
		<div class="landing">
			<h1>{@html hed}</h1>
			<div class="dek">{dek.split(" ").slice(0, 4).join(" ")}</div>
			<div class="dek">{dek.split(" ").slice(4).join(" ")}</div>
			<div class="byline" style:margin-bottom="3em">{@html byline}</div>

			<button class="start" on:click={start} disabled={$started}>start</button>
			<button class="mute" on:click={() => ($soundOn = !$soundOn)}
				>{$soundOn ? "sound off" : "sound on"}</button
			>
		</div>
	{/if}

	<div class="sections" class:started={$started}>
		{#each sections as { id, title, chunks }}
			<Section {id} {title} {chunks} />
		{/each}

		<Footer />
	</div>
</article>

<style>
	.landing {
		height: calc(100vh - 79.43px);
	}
	.sections {
		visibility: hidden;
	}
	.sections.started {
		visibility: visible;
	}
	article {
		height: calc(100vh - 79.43px);
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
