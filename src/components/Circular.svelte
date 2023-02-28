<script>
	import Row from "$components/Row.svelte";
	import { onDestroy, onMount } from "svelte";
	import { t } from "$stores/misc.js";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range } from "d3";

	export let data;

	let interval;
	const height = 500;
	const duration = 3000;
	const start = 0;
	const end = 4;

	$: rScale = scaleLinear()
		.domain([0, 4])
		.range([0, 2 * Math.PI]);

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
	<circle r={height / 2 - 100} cx={"50%"} cy={"50%"} />

	{#key data}
		{#each Object.keys(data) as instrument, i}
			<Row
				id={instrument}
				{i}
				data={data[instrument]}
				{rScale}
				type={"circular"}
			/>
		{/each}
	{/key}
</svg>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	svg {
		background: var(--color-gray-100);
	}
	circle {
		stroke: var(--color-gray-500);
		stroke-width: 1px;
		fill: none;
	}
	line {
		stroke: black;
		stroke-width: 1px;
	}
</style>
