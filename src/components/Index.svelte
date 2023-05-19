<script>
	import Mute from "$components/Mute.svelte";
	import IntroAnimation from "$components/IntroAnimation.svelte";
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { started, scrollyStep, direction } from "$stores/misc.js";
	import { onMount, tick } from "svelte";
	import copy from "$data/copy.json";

	const { hed, dek, byline } = copy;

	let startEl;

	const start = async () => {
		$started = true;
		await tick();
		startEl.scrollIntoView({ block: "center", behavior: "smooth" });
	};

	const debug = ["straight"];
	const sections = copy.sections.filter((d) => debug.includes(d.id));
	$started = true;

	//const sections = copy.sections;

	onMount(() => {
		startEl = document.getElementById("start-of-story");
	});
</script>

<IntroAnimation />

<article class:started={$started}>
	{#if debug.length === 0}
		<div class="landing">
			<h1>{@html hed}</h1>
			<div class="dek">{dek.split(" ").slice(0, 4).join(" ")}</div>
			<div class="dek">{dek.split(" ").slice(4).join(" ")}</div>
			<div class="byline" style:margin-bottom="3em">{@html byline}</div>

			<div class="buttons">
				<button class="start" on:click={start}>start audio story</button>
				<Mute label={"bottom"} />
			</div>

			<div
				class="fixed-mute"
				class:visible={$started &&
					($scrollyStep !== undefined || $direction === "down")}
			>
				<Mute label={"left"} />
			</div>
		</div>
	{/if}

	<div class="sections" class:started={$started}>
		{#each sections as { id, title, chunks }}
			{#if id === "bonus"}
				<details>
					<summary>{title}</summary>
					<Section {id} {chunks} />
				</details>
			{:else}
				<Section {id} {title} {chunks} />
			{/if}
		{/each}

		<iframe
			style="border-radius:12px"
			src="https://open.spotify.com/embed/playlist/2lv10HmmIbXoknNEoNDt2s?utm_source=generator&theme=0"
			width="100%"
			height="352"
			frameBorder="0"
			allowfullscreen=""
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			loading="lazy"
		/>

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
	.buttons {
		display: flex;
	}
	.fixed-mute {
		position: fixed;
		z-index: 100000;
		top: 1em;
		right: 1em;
		opacity: 0;
		transition: opacity 500ms;
	}
	.fixed-mute.visible {
		opacity: 1;
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
		font-size: 1.5em;
		margin-right: 1em;
	}
	:global(.byline a) {
		color: var(--color-black);
	}
	:global(.byline a:hover) {
		color: var(--color-gray-700);
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

	@media (max-width: 600px) {
		h1 {
			font-size: 6em;
		}
	}
</style>
