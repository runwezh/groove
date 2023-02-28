<script>
	import Row from "$components/Row.svelte";
	import { onDestroy, onMount } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range, arc } from "d3";
	import { tweened } from "svelte/motion";

	export let data;
	export let beats;
	export let parts;
	export let showPercentage;
	export let showDivisions;

	export const t = tweened(0);
	let interval;
	const height = 500;
	const duration = beats === 1 ? 900 : 2800;
	const start = 0;
	$: end = beats;

	$: rScale = scaleLinear()
		.domain([0, end])
		.range([-Math.PI / 2, (3 / 2) * Math.PI]); // to make 0 at the top

	const circleR = height / 2 - 100;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);

	$: percentageArc = arc()
		.innerRadius(0)
		.outerRadius(circleR)
		.startAngle(rScale(data.hihat[0]) + Math.PI / 2)
		.endAngle(rScale(data.hihat[1]) + Math.PI / 2);

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
	<circle id="outer" r={circleR} cx={"50%"} cy={"50%"} />

	{#if showPercentage}
		<path
			fill="gold"
			d={percentageArc()}
			style:transform="translate(50%, 50%)"
		/>
	{/if}
	{#if showDivisions}
		{#each range(0, 1, 1 / parts) as i}
			<line
				x1={$viewport.width / 2}
				y1={height / 2}
				x2={$viewport.width / 2 + (height / 2 - 100) * Math.cos(rScale(i))}
				y2={height / 2 + (height / 2 - 100) * Math.sin(rScale(i))}
			/>
		{/each}
	{/if}

	<line
		id="marker"
		x1={0}
		y1={0}
		x2={x(rScale($t))}
		y2={y(rScale($t))}
		style:transform="translate(50%, 50%)"
	/>

	{#key data}
		{#each Object.keys(data) as instrument, i}
			<Row
				id={instrument}
				{i}
				data={data[instrument]}
				{rScale}
				type={"circular"}
				t={$t}
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
	#outer {
		stroke: var(--color-gray-500);
		stroke-width: 1px;
		fill: none;
	}
	#marker {
		stroke: var(--color-gray-700);
		stroke-width: 3px;
	}
	line {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
	}
</style>
