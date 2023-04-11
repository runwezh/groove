<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	import Instrument from "$components/Linear.Instrument.svelte";
	import { setContext } from "svelte";
	import { scaleLinear, scaleBand, range } from "d3";
	import { writable } from "svelte/store";

	export let id;
	export let data;
	export let audio;
	export let beatsPerRotation;

	let division = 2;

	setContext("song", {
		beatsPerRotation,
		division,
		getT: () => currentBeat,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getGridToggles: () => gridToggles,
		getCycleDuration: () => duration
	});

	const currentBeat = writable(0);
	const xScale = writable(undefined);

	let animationFrameId;
	let seek = 0;
	const height = 500;
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const gridToggles = writable({
		hihat: "off",
		snare: "off",
		kick: "off"
	});
	let instrumentsWidth;

	let timeToBeat = () => 0;
	audio.on("load", () => {
		updateTimeScale();
	});

	const updateTimeScale = () => {
		timeToBeat = scaleLinear()
			.domain([0, audio.duration() * 1000])
			.range([0, beatsPerRotation]);
	};

	$: id, updateTimeScale();
	$: duration = audio.duration() * 1000;
	$: $currentBeat = seek === 0 ? 0 : timeToBeat(seek * 1000);
	$: $xScale = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([0, instrumentsWidth]);
	$: yScale = scaleBand()
		.domain(Object.keys(data))
		.range([0, height])
		.padding(0.45);
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
	<!-- <Raindrops {data} /> -->

	<!-- <div class="labels">
		{#each Object.keys(data) as instrument, i}
			<div class="sidebar" style:height={`${barHeight}px`}>
				<div class="label">{instrument}</div>
				<div class="toggle">
					<Toggle
						label="Show grid"
						style="inner"
						bind:value={$gridToggles[instrument]}
					/>
				</div>
			</div>
		{/each}
	</div> -->

	<div class="instruments" bind:clientWidth={instrumentsWidth}>
		<!-- <div class="marker" style:left={`${$xScale($currentBeat)}px`} /> -->

		<!-- <div
			class="grid"
			style="position: absolute; top: 0; height: 100%; width: 100%"
		>
			{#each range(0, beatsPerRotation, 1 / division) as bar}
				{@const thick = bar % 1 === 0}
				{@const left = $xScale(bar)}

				<div
					class="line"
					class:thick
					style="background: var(--color-gray-500); width: 1px; position: absolute; height: 100%"
					style:left={`${left}px`}
				/>
			{/each}
		</div> -->

		{#if instrumentsWidth}
			{#each Object.keys(data) as instrument, i}
				<Instrument
					data={data[instrument]}
					id={instrument}
					height={barHeight}
				/>
			{/each}
		{/if}
	</div>
</div>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	.container {
		width: 100%;
		display: flex;
		position: relative;
	}
	.instruments {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
	}
	.labels {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 100px;
	}
	.sidebar {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.label {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
	}
	.toggle {
		color: white;
		font-size: 12px;
	}
	.marker {
		position: absolute;
		background: burlywood;
		width: 5px;
		height: 100%;
		z-index: 100;
	}
</style>
