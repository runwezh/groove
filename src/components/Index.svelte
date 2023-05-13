<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { soundOn, started } from "$stores/misc.js";
	import { onMount, tick } from "svelte";
	import copy from "$data/copy.json";

	const { hed, dek, byline } = copy;

	let startEl;

	const start = async () => {
		$started = true;
		await tick();
		startEl.scrollIntoView({ block: "center", behavior: "smooth" });
	};

	const debug = [];
	// const sections = copy.sections.filter((d) => debug.includes(d.id));
	// $started = true;

	const sections = copy.sections;

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

			<div class="mute-container">
				<button on:click={() => ($soundOn = !$soundOn)} class:faded={!$soundOn}>
					{#if $soundOn}
						<Icon name="volume-2" />
					{:else}
						<Icon name="volume-x" />
					{/if}
				</button>
				<div class:visible={!$soundOn}>{"(sound is recommended!)"}</div>
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
	.mute-container {
		position: fixed;
		z-index: 100000;
		top: 1em;
		right: 1em;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.mute-container button {
		padding: 0.4em 0.4em 0.1em 0.4em;
		font-size: var(--28px);
	}
	.mute-container button.faded {
		opacity: 0.5;
	}
	.mute-container div {
		font-size: var(--14px);
		margin-top: 8px;
		position: absolute;
		left: 0;
		transform: translate(calc(-100% - 8px), 0);
		text-align: center;
		color: var(--accent);
		visibility: hidden;
	}
	.mute-container div.visible {
		visibility: visible;
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
	details {
		background: var(--color-gray-800);
		border: 3px solid var(--accent-light);
		padding: 2em;
	}
	summary:hover {
		cursor: pointer;
	}
	summary::marker {
		color: var(--accent-light);
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 6em;
		}
		.mute-container {
			font-size: var(--20px);
		}
	}
</style>
