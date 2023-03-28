<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	import Instrument from "$components/Linear.Instrument.svelte";
	import { setContext } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, scaleBand, range } from "d3";
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

	let timeToBeat = () => 0;
	audio.on("load", () => {
		timeToBeat = scaleLinear()
			.domain([0, audio.duration() * 1000])
			.range([0, beatsPerRotation]);
	});

	$: duration = audio.duration() * 1000;
	$: $currentBeat = seek === 0 ? 0 : timeToBeat(seek * 1000);
	$: xScale = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([0, $viewport.width - padding.left - padding.right]);
	$: yScale = scaleBand()
		.domain(Object.keys(data))
		.range([0, height - padding.top - padding.bottom])
		.padding(0.25);
	$: barHeight = yScale.bandwidth();

	audio.on("end", () => {
		play();
	});
	const play = () => {
		audio.play();
		animationFrameId = requestAnimationFrame(updateSeek);
	};
	const pause = () => {
		cancelAnimationFrame(animationFrameId);
		audio.pause();
	};
	const updateSeek = () => {
		seek = audio.seek();
		animationFrameId = requestAnimationFrame(updateSeek);
	};
</script>

<div class="container" style:height={`${height}px`}>
	<div class="labels">
		{#each Object.keys(data) as instrument, i}
			<div class="label" style:height={`${barHeight}px`}>{instrument}</div>
		{/each}
	</div>

	<div class="instruments">
		<div class="marker" style:left={`${xScale($currentBeat)}px`} />

		{#each Object.keys(data) as instrument, i}
			<Instrument data={data[instrument]} id={instrument} height={barHeight} />
		{/each}

		<div class="grid">
			{#each range(0, beatsPerRotation, 1 / division) as bar}
				{@const thick = bar % 1 === 0}
				{@const left = xScale(bar)}
				{@const visible = showGrid === "on"}
				<div
					class="gridline"
					class:thick
					class:visible
					style:left={`${left}px`}
					style:height={`${height}px`}
				/>
			{/each}
		</div>
	</div>
</div>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<Toggle label="Show grid" style="inner" bind:value={showGrid} />
<ul>
	<li>click a track to mute it</li>
	<li>blue notes are ones that don't fall on the 16th note grid</li>
</ul>

<style>
	.container {
		width: 100%;
		background: #080e1c;
		display: flex;
	}
	.instruments {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
	}
	.labels {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100px;
	}
	.label {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
	}
	.grid {
		position: absolute;
	}
	.gridline {
		position: absolute;
		background: var(--color-gray-400);
		width: 1px;
		opacity: 0;
	}
	.gridline.visible {
		opacity: 1;
	}
	.thick {
		background: var(--color-gray-600);
		width: 2px;
	}
	.marker {
		position: absolute;
		background: black;
		width: 5px;
		height: 100%;
	}
</style>
