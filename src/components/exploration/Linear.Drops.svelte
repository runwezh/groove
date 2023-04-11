<script>
	import { getContext } from "svelte";

	export let notes;
	export let instrument;

	const { getT } = getContext("song");
	const t = getT();
	const colors = { hihat: "cyan", snare: "orange", kick: "lime" };
	const rs = { hihat: 30, snare: 50, kick: 120 };

	const width = 1000;
	const height = 800;
	const dropDuration = 3000;

	const buffer = 0.05;
</script>

{#each notes as note}
	{@const cx = Math.random() * width}
	{@const cy = Math.random() * height}
	{@const stroke = colors[instrument]}
	{@const r = rs[instrument]}
	<circle
		{stroke}
		{cx}
		{cy}
		{r}
		class:played={$t >= note - buffer}
		style={`--duration: ${dropDuration}ms`}
	/>
{/each}

<style>
	circle {
		stroke-width: 2px;
		fill: none;
		transform-box: fill-box;
		transform-origin: 50% 50%;
		opacity: 0;
	}
	.played {
		animation: var(--duration) drop;
	}

	@keyframes drop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
</style>
