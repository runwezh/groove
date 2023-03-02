<script>
	import Instrument from "$components/Instrument.svelte";
	import { onDestroy, setContext } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range, arc } from "d3";
	import { tweened } from "svelte/motion";
	import Toggle from "$components/helpers/Toggle.svelte";

	export let data;
	export let beatsPerRotation;
	export let division;
	export let bpm;
	export let showPercentage;
	export let showDivisions;

	setContext("song", {
		beatsPerRotation,
		division,
		getT: () => t,
		getAngleScale: () => angleScale,
		getInstrumentToggles: () => instrumentToggles,
		getCycleDuration: () => duration
	});

	let interval;

	const instrumentToggles = {
		hihat: "on",
		snare: "on",
		kick: "on"
	};
	let showGrid = "off";

	const t = tweened(0);
	const height = 500;
	const start = 0;
	const circleR = height / 2 - 100;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);

	$: end = beatsPerRotation;
	$: percentageArc = arc()
		.innerRadius(0)
		.outerRadius(circleR)
		.startAngle(angleScale(data.hihat[0]) + Math.PI / 2)
		.endAngle(angleScale(data.hihat[1]) + Math.PI / 2);
	$: duration = (60000 * beatsPerRotation) / bpm;
	$: angleScale = scaleLinear()
		.domain([0, end])
		.range([-Math.PI / 2, (3 / 2) * Math.PI]); // to make 0 at the top

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
	<circle id="outer" r={circleR} cx={"50%"} cy={"50%"} />

	{#if showPercentage === "on"}
		<path
			fill="gold"
			d={percentageArc()}
			style:transform="translate(50%, 50%)"
		/>
	{/if}
	{#if showDivisions === "on"}
		{#each range(0, 1, 1 / division) as i}
			<line
				x1={$viewport.width / 2}
				y1={height / 2}
				x2={$viewport.width / 2 + circleR * Math.cos(angleScale(i))}
				y2={height / 2 + circleR * Math.sin(angleScale(i))}
			/>
		{/each}
	{/if}
	{#if showGrid === "on"}
		{#each range(0, beatsPerRotation, 0.25) as i}
			<line
				x1={$viewport.width / 2}
				y1={height / 2}
				x2={$viewport.width / 2 + circleR * Math.cos(angleScale(i))}
				y2={height / 2 + circleR * Math.sin(angleScale(i))}
			/>
		{/each}
	{/if}

	<line
		id="marker"
		x1={0}
		y1={0}
		x2={x(angleScale($t))}
		y2={y(angleScale($t))}
		style:transform="translate(50%, 50%)"
	/>

	{#key data}
		{#each Object.keys(data) as instrument, i}
			<Instrument id={instrument} {i} data={data[instrument]} />
		{/each}
	{/key}
</svg>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>
<Toggle label="Show grid" style="inner" bind:value={showGrid} />
<Toggle label="Hi-hat" style="inner" bind:value={instrumentToggles["hihat"]} />
<Toggle label="Kick" style="inner" bind:value={instrumentToggles["kick"]} />
<Toggle label="Snare" style="inner" bind:value={instrumentToggles["snare"]} />

<style>
	svg {
		background: var(--color-gray-100);
	}
	#outer {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
		fill: none;
	}
	line {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
		stroke-dasharray: 10px;
	}
	#marker {
		stroke: var(--color-gray-800);
		stroke-width: 4px;
		stroke-dasharray: 0px;
	}
</style>
