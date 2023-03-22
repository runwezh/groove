<script>
	import { Howl } from "howler";
	import Toggle from "$components/helpers/Toggle.svelte";
	import Instrument from "$components/Linear.Instrument.svelte";
	import { onDestroy, setContext } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, scaleBand, range } from "d3";
	import { tweened } from "svelte/motion";
	import { writable } from "svelte/store";

	export let data;
	export let audio;
	export let beatsPerRotation;
	export let division;

	setContext("song", {
		beatsPerRotation,
		division,
		getT: () => currentBeat,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getCycleDuration: () => duration
	});

	const currentBeat = writable(0);
	$: currentBeat.set(seek === 0 ? 0 : timeToBeat(seek * 1000));

	let animationFrameId;
	let seek = 0;
	let showGrid = "off";
	let showDivision = "off";
	let interval;
	const height = 500;
	const start = 0;
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const padding = { top: 0, right: 0, bottom: 0, left: 60 };

	let timeToBeat;
	audio.on("load", () => {
		timeToBeat = scaleLinear()
			.domain([0, audio.duration() * 1000])
			.range([0, beatsPerRotation]);
	});

	$: duration = audio.duration() * 1000;
	$: xScale = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([0, $viewport.width - padding.left - padding.right]);
	$: yScale = scaleBand()
		.domain(Object.keys(data))
		.range([0, height - padding.top - padding.bottom])
		.padding(0.25);
	$: barHeight = yScale.bandwidth();

	const updateSeek = () => {
		seek = audio.seek();
		animationFrameId = requestAnimationFrame(updateSeek);
	};
	const pause = () => {
		cancelAnimationFrame(animationFrameId);
		audio.pause();
	};
	const play = () => {
		audio.play();
		animationFrameId = requestAnimationFrame(updateSeek);
	};
	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};
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

		{#each range(0, beatsPerRotation, 1 / division) as bar}
			{@const thick = bar % 1 === 0}
			<line
				class="grid"
				class:visible={showGrid === "on"}
				class:thick
				x1={xScale(bar)}
				x2={xScale(bar)}
				y1={0}
				y2={height}
			/>
		{/each}

		<!-- {#if showDivision === "on"}
			{#each range(0, 4 / 3, 1 / 3) as div}
				<line x1={xScale(div)} x2={xScale(div)} y1={0} y2={height} />
			{/each}
		{/if} -->

		<line
			class="marker"
			x1={xScale($currentBeat)}
			x2={xScale($currentBeat)}
			y1={0}
			y2={height}
		/>
	</g>
</svg>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<Toggle label="Show grid" style="inner" bind:value={showGrid} />
<ul>
	<li>click a track to mute it</li>
	<li>blue notes are ones that don't fall on the 16th note grid</li>
</ul>

<!-- <Toggle label="Show division" style="inner" bind:value={showDivision} /> -->
<style>
	svg {
		background: var(--color-gray-100);
	}
	.grid {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
		opacity: 0;
	}
	.grid.visible {
		opacity: 1;
	}
	.thick {
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
