<script>
	import Ball from "$components/Ball.svelte";
	import { tweened } from "svelte/motion";
	import { onDestroy, setContext } from "svelte";
	import { scaleBand } from "d3";
	import viewport from "$stores/viewport.js";

	export let data;
	export let beatsPerRotation;
	export let bpm;

	setContext("song", {
		beatsPerRotation,
		getT: () => t,
		getCycleDuration: () => duration
	});

	const start = 0;
	const end = 4;
	const height = 500;
	const t = tweened(0);

	$: duration = (60000 * beatsPerRotation) / bpm;
	$: xScale = scaleBand()
		.domain(Object.keys(data))
		.range([0, $viewport.width])
		.padding(0.1);

	let interval;
	const pause = () => {
		clearInterval(interval);
		t.set(end, { duration: 0 });
	};
	const play = () => {
		t.set(start, { duration: 0 });
		t.set(end, { duration });
		interval = setInterval(() => {
			t.set(start, { duration: 0 });
			t.set(end, { duration });
		}, duration);
	};

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="background">
	{#each Object.keys(data) as instrument, i}
		<div class="row">
			<Ball id={instrument} {i} data={data[instrument]} />
		</div>
	{/each}
</div>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	svg {
		background: var(--color-gray-100);
	}
	.background {
		background: var(--color-gray-100);
		height: 400px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.row {
		display: flex;
		height: 100px;
		position: relative;
	}
</style>
