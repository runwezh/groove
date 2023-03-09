<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	import Instrument from "$components/Linear.Instrument.svelte";
	import { onDestroy, setContext } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, scaleBand, range } from "d3";
	import { tweened } from "svelte/motion";
	import { writable } from "svelte/store";

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
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getCycleDuration: () => duration
	});

	let showGrid = "off";
	let showDivision = "off";
	let interval;
	const height = 500;
	const start = 0;
	const t = tweened(0);
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const padding = { top: 0, right: 0, bottom: 0, left: 60 };

	$: end = beatsPerRotation;
	$: duration = (60000 * beatsPerRotation) / bpm;
	$: xScale = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([0, $viewport.width - padding.left - padding.right]);
	$: yScale = scaleBand()
		.domain(Object.keys(data))
		.range([0, height - padding.top - padding.bottom])
		.padding(0.25);
	$: barHeight = yScale.bandwidth();

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
	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<svg width={"100%"} {height}>
	<g class="wrapper" transform={`translate(${padding.left}, ${padding.top})`}>
		{#each Object.keys(data) as instrument, i}
			<g
				class="instrument"
				transform={`translate(0, ${yScale(instrument)})`}
				on:click={() => toggleSound(instrument)}
			>
				<Instrument
					data={data[instrument]}
					id={instrument}
					height={barHeight}
				/>
				<text x={-10} y={barHeight / 2}>{instrument}</text>
			</g>
		{/each}
		{#if showGrid === "on"}
			{#each range(0, beatsPerRotation, 1 / division) as bar}
				{@const thick = bar % 1 === 0}
				<line
					class:thick
					x1={xScale(bar)}
					x2={xScale(bar)}
					y1={0}
					y2={height}
				/>
			{/each}
		{/if}

		<!-- {#if showDivision === "on"}
			{#each range(0, 4 / 3, 1 / 3) as div}
				<line x1={xScale(div)} x2={xScale(div)} y1={0} y2={height} />
			{/each}
		{/if} -->

		<line class="marker" x1={xScale($t)} x2={xScale($t)} y1={0} y2={height} />
	</g>
</svg>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>
<Toggle label="Show grid" style="inner" bind:value={showGrid} />

<!-- <Toggle label="Show division" style="inner" bind:value={showDivision} /> -->
<style>
	svg {
		background: var(--color-gray-100);
	}
	line {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
	}
	line.thick {
		stroke: var(--color-gray-600);
		stroke-width: 3px;
	}
	line.marker {
		stroke-width: 4px;
		stroke: var(--color-gray-800);
	}
	.instrument:hover {
		cursor: pointer;
	}
	text {
		text-anchor: end;
		alignment-baseline: middle;
	}
</style>
