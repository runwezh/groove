<script>
	import Mute from "$components/Mute.svelte";
	import copy from "$data/copy.json";
	import { started, scrollyStep, direction } from "$stores/misc.js";

	const { hed, dek, byline, byline_illo } = copy;

	const start = async () => {
		$started = true;
		await tick();
		startEl.scrollIntoView({ block: "center", behavior: "smooth" });
	};
</script>

<div class="landing">
	<h1>{@html hed}</h1>

	<div class="dek">{@html dek}</div>

	<div class="image">
		<img
			src="assets/img/header_transparent.png"
			alt="illustration of erykah badu, j dilla on his drum machine, and stevie wonder"
		/>
	</div>

	<div class="byline">{@html byline}</div>

	<div class="byline illo">{@html byline_illo}</div>

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

<style>
	.landing {
		height: calc(100vh - 79.43px);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	img {
		width: 100%;
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
		line-height: 190px;
		color: var(--accent);
		margin: 0;
	}
	.image {
		position: relative;
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
	}
	.byline {
		font-family: var(--mono);
	}
	.illo {
		font-size: var(--16px);
		margin-top: 0.6em;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 6em;
		}
	}
</style>
