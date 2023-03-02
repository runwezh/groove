<script>
	import Instrument from "$components/Instrument.svelte";
	import { onDestroy, onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range } from "d3";
	import { tweened } from "svelte/motion";

	export let data;
	export let beatsPerRotation;
	export let division;
	export let bpm;
	export let showPercentage;
	export let showDivisions;

	let interval;
	const height = 200;
	const start = 0;
	const t = tweened(0);

	$: end = beatsPerRotation;
	$: duration = (60000 * beatsPerRotation) / bpm;
	$: xScale = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([0, $viewport.width]);
	$: yScale = scaleLinear()
		.domain([0, Object.keys(data).length - 1])
		.range([0, height - 50]);

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

<svg width={"100%"} {height}>
	{#each Object.keys(data) as instrument, i}
		<Instrument
			id={instrument}
			{i}
			data={data[instrument]}
			{xScale}
			{yScale}
			type="linear"
			t={$t}
		/>
	{/each}
	{#each range(0, beatsPerRotation, 0.25) as bar}
		<line x1={xScale(bar)} x2={xScale(bar)} y1={0} y2={height} />
	{/each}
</svg>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	svg {
		background: var(--color-gray-100);
	}
	line {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
	}
</style>
