<script>
	import Result from "$components/Grid.Result.svelte";
	import Play from "$components/Play.svelte";
	import Instrument from "$components/Grid.Instrument.svelte";
	import { setContext } from "svelte";
	import { scaleLinear, scaleBand, range } from "d3";
	import { writable } from "svelte/store";
	import jsonToBeat from "$utils/jsonToBeat.js";
	import kamaal from "$data/kamaal.json";
	import sincerity from "$data/sincerity.json";
	import lightSwitch from "$data/lightSwitch.json";
	import dmatSwung from "$data/dmatSwung.json";
	import dmatStraight from "$data/dmatStraight.json";
	import _ from "lodash";
	import { previous } from "$stores/previous.js";

	export let id;
	export let beatsPerMeasure = 4;
	export let measures;
	export let playable = false;

	let animationFrameId;

	const seek = writable(0);
	const previousSeek = previous(seek);

	setContext("song", {
		songId: id,
		beatsPerMeasure,
		getCurrentBeat: () => currentBeat,
		getCurrentMeasure: () => currentMeasure,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getCycleDuration: () => duration,
		getIsPlaying: () => isPlaying,
		getData: () => data,
		isPlayable: playable
	});

	const height = 500;
	const audio = new Howl({
		src: [`assets/sound/${id.includes("dmat") ? "dmat" : id}.mp3`],
		preload: true
	});
	const songs = {
		kamaal: kamaal,
		sincerity: sincerity,
		lightSwitch: lightSwitch,
		dmatSwung: dmatSwung,
		dmatStraight: dmatStraight
	};

	const data = writable({});
	const currentBeat = writable(0);
	const currentMeasure = writable(0);
	const xScale = writable(undefined);
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const isPlaying = writable(false);

	let instrumentsWidth;
	let timeToBeat = () => 0;

	$: console.log(audio.duration());

	audio.on("load", () => {
		updateTimeScale();
	});
	const updateTimeScale = () => {
		timeToBeat = scaleLinear()
			.domain([0, audio.duration() * 1000])
			.range([0, beatsPerMeasure * measures]);
	};

	$: id, updateTimeScale();
	$: duration = audio.duration() * 1000;
	$: $currentBeat = timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $currentMeasure = Math.floor(timeToBeat($seek * 1000) / beatsPerMeasure);
	$: $xScale = scaleLinear()
		.domain([0, beatsPerMeasure])
		.range([0, instrumentsWidth]);
	$: yScale = scaleBand()
		.domain(Object.keys($data))
		.range([0, height])
		.padding(0.45);
	$: barHeight = yScale.bandwidth();
	$: $data = playable
		? { hihat: [] }
		: id === "sincerity"
		? _.pick(jsonToBeat(id, songs[id], beatsPerMeasure, measures), "hihat")
		: jsonToBeat(id, songs[id], beatsPerMeasure, measures);

	let result = [];

	audio.on("end", () => {
		if (playable) reset();
		play();
	});
	const reset = () => {
		result = $data.hihat;
		$data = { hihat: [] };
	};

	const play = () => {
		$isPlaying = true;
		audio.play();
		animationFrameId = requestAnimationFrame(updateSeek);
	};
	const pause = () => {
		$isPlaying = false;
		cancelAnimationFrame(animationFrameId);
		audio.pause();
	};
	const updateSeek = () => {
		$seek = audio.seek() - 0.19; // TODO: why??
		animationFrameId = requestAnimationFrame(updateSeek);
	};
</script>

<p>{$seek.toFixed(2)}s</p>
<p>beat: {$currentBeat.toFixed(2)}</p>
<p>measure: {$currentMeasure}</p>
<p>playable: {playable}</p>

<div
	class="container"
	style:height={`${height}px`}
	style:background={Math.floor($currentBeat) % 2 ? "blue" : "orange"}
>
	<div class="instruments" bind:clientWidth={instrumentsWidth}>
		<div class="marker" style:left={`${$xScale($currentBeat)}px`} />

		<div class="grid">
			{#each range(0, beatsPerMeasure) as bar}
				{@const thick = bar % 1 === 0}
				{@const left = $xScale(bar)}

				<div class="line" class:thick style:left={`${left}px`} />
			{/each}
		</div>

		{#if instrumentsWidth}
			{#each Object.keys($data) as instrument, i}
				<Instrument
					data={$data[instrument]}
					id={instrument}
					height={barHeight}
				/>
			{/each}
		{/if}
	</div>
</div>

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

{#if playable}
	<Play />
	<Result data={result} {barHeight} />
{/if}

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
		background: var(--color-gray-300);
		opacity: 0.5;
		width: 5px;
		height: 100%;
		transform: translate(-50%, 0);
	}
	.grid {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
	}
	.grid .line {
		background: var(--color-gray-200);
		width: 1px;
		position: absolute;
		height: 100%;
	}
</style>
