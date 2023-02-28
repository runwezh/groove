<script>
	import Row from "$components/Row.svelte";
	import { onDestroy, onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range } from "d3";

	export let data;

	let interval;
	const height = 500;
	const duration = 3000;
	const start = 0;
	const end = 4;

	$: xScale = scaleLinear().domain([0, 4]).range([0, $viewport.width]);
	$: yScale = scaleLinear().domain([0, 2]).range([0, 450]);

	const pause = () => {
		clearInterval(interval);
	};
	const play = () => {
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
		<Row
			id={instrument}
			{i}
			data={data[instrument]}
			{xScale}
			{yScale}
			type="linear"
		/>
	{/each}
	{#each range(0, 4, 0.5) as bar}
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
		stroke: black;
		stroke-width: 1px;
	}
</style>
