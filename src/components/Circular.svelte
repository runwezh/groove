<script>
	import Row from "$components/Row.svelte";
	import { onDestroy, onMount } from "svelte";
	import { t } from "$stores/misc.js";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range, line, lineRadial } from "d3";

	export let data;

	let interval;
	const height = 500;
	const duration = 2800;
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

	const lineGenerator = line()
		.x((d) => d.x)
		.y((d) => d.y);

	$: console.log(
		lineGenerator([
			{ x: 0, y: 0 },
			{ x: 1, y: 1 },
			{ x: 2, y: 2 }
		])
	);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<svg width={"100%"} {height}>
	<circle r={height / 2 - 100} cx={"50%"} cy={"50%"} />
	{#each range(0, 4, 0.25) as i}
		<line
			x1={$viewport.width / 2}
			y1={height / 2}
			x2={$viewport.width / 2 + (height / 2 - 100) * Math.cos(rScale(i))}
			y2={height / 2 + (height / 2 - 100) * Math.sin(rScale(i))}
		/>
	{/each}

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
		stroke: var(--color-gray-300);
		stroke-width: 1px;
	}
</style>
