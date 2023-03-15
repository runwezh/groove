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

<!-- <svg width={"100%"} {height}> -->
<div>
	{#each Object.keys(data).filter((d) => d === "snare") as instrument, i}
		<!-- <g transform={`translate(${xScale(instrument)}, 0)`}> -->
		<Ball id={instrument} {i} data={data[instrument]} />
		<!-- </g> -->
	{/each}
</div>
<!-- </svg> -->

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	svg {
		background: var(--color-gray-100);
	}
	div {
		background: var(--color-gray-100);
		height: 400px;
		position: relative;
	}
</style>
