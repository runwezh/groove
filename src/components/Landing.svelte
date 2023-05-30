<script>
	import Mute from "$components/Mute.svelte";
	import { tick, onMount } from "svelte";
	import copy from "$data/copy.json";
	import { started, scrollyStep, direction } from "$stores/misc.js";
	import { fade } from "svelte/transition";

	const { hed, dek, byline } = copy;

	let startEl;

	const start = async () => {
		$started = true;
		await tick();
		startEl.scrollIntoView({ block: "center", behavior: "smooth" });
	};

	onMount(() => {
		startEl = document.getElementById("start-of-story");
	});
</script>

<div class="landing">
	<div class="contents">
		<h1>{@html hed}</h1>

		<div class="dek">{@html dek}</div>

		<img
			src="assets/img/header_transparent.png"
			alt="illustration of erykah badu, j dilla on his drum machine, and stevie wonder"
		/>

		<div class="byline">{@html byline}</div>

		<div class="buttons">
			<button class="start" on:click={start}>start audio story</button>
			<Mute label={"bottom"} />
		</div>

		{#if $started && ($scrollyStep !== undefined || $direction === "down")}
			<div class="fixed-mute" transition:fade>
				<Mute label={"left"} />
			</div>
		{/if}
	</div>
</div>

<style>
	.landing {
		height: calc(100vh - 78.92px);
	}
	.contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		width: 100%;
		left: 0;
		top: 78.92px;
		padding: 0 1em;
		min-height: 80%;
		justify-content: space-between;
	}
	img {
		max-height: 45vh;
		width: auto;
		margin: 0 auto;
		max-width: 90%;
	}
	.fixed-mute {
		position: fixed;
		z-index: 100000;
		top: 1em;
		right: 1em;
		transition: opacity calc(var(--1s) * 0.5);
	}
	h1 {
		font-family: var(--mono);
		font-size: 10em;
		line-height: 190px;
		color: var(--accent);
		margin: 0;
	}
	.buttons {
		margin-top: 3em;
		display: flex;
	}
	button.start {
		font-size: 1.5em;
		margin-right: 1em;
	}
	.dek {
		font-size: var(--20px);
		text-align: center;
	}
	.byline {
		font-family: var(--mono);
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 6em;
			line-height: 125px;
		}
	}
	@media (max-height: 900px) {
		h1 {
			font-size: 6em;
			line-height: 125px;
		}
		button.start {
			font-size: 1em;
		}
		.buttons {
			margin-top: 1em;
		}
	}
	@media (max-height: 750px) {
		h1 {
			font-size: 4em;
			line-height: 90px;
		}
		img {
			max-height: 30vh;
		}
	}
</style>
