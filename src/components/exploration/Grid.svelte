<script>
	import Result from "$components/Grid.Result.svelte";
	import Toggle from "$components/helpers/Toggle.svelte";
	import Marker from "$components/Song.Marker.svelte";
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

	export let id;
	export let beatsPerMeasure = 4;
	export let measures;
	export let playable = false;

	let result = [];
	let audioEl;
	let instrumentsWidth;
	let swing = "on";

	setContext("song", {
		songId: id,
		beatsPerMeasure,
		getCurrentBeat: () => currentBeat,
		getCurrentMeasure: () => currentMeasure,
		getTimeToBeat: () => timeToBeat,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getIsPlaying: () => isPlaying,
		getData: () => data,
		getSeek: () => seek,
		isPlayable: playable
	});

	const height = 500;
	const songs = {
		kamaal: kamaal,
		sincerity: sincerity,
		lightSwitch: lightSwitch,
		dmatSwung: dmatSwung,
		dmatStraight: dmatStraight
	};

	const seek = writable(0);
	const data = writable({});
	const currentBeat = writable(0);
	const currentMeasure = writable(0);
	const timeToBeat = writable(undefined);
	const xScale = writable(undefined);
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const isPlaying = writable(false);

	$: audioDuration = audioEl && audioEl.duration ? audioEl.duration * 1000 : 0;
	$: $timeToBeat = scaleLinear()
		.domain([0, audioDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $currentMeasure = Math.floor($timeToBeat($seek * 1000) / beatsPerMeasure);
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
		: id === "dmat"
		? _.pick(
				jsonToBeat(
					swing === "on" ? "dmatSwung" : "dmatStraight",
					songs[swing === "on" ? "dmatSwung" : "dmatStraight"],
					beatsPerMeasure,
					measures
				),
				"hihat"
		  )
		: id === "sincerity"
		? _.pick(jsonToBeat(id, songs[id], beatsPerMeasure, measures), "hihat")
		: jsonToBeat(id, songs[id], beatsPerMeasure, measures);
	$: if (playable && $seek === 0) reset();

	const reset = () => {
		result = $data.hihat;
		$data = { hihat: [] };
	};
	const play = () => {
		$isPlaying = true;
		audioEl.play();
	};
	const pause = () => {
		$isPlaying = false;
		audioEl.pause();
	};
</script>

<audio
	bind:this={audioEl}
	src={`assets/sound/${id}.mp3`}
	bind:currentTime={$seek}
	loop={true}
/>

<p>{$seek.toFixed(2)}s</p>
<p>beat: {$currentBeat.toFixed(2)}</p>
<p>measure: {$currentMeasure}</p>

{#if id === "dmat"}
	<Toggle label="swing" style="inner" bind:value={swing} />
{/if}

<div class="container" style:height={`${height}px`}>
	<div class="instruments" bind:clientWidth={instrumentsWidth}>
		<Marker />

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
	audio {
		display: none;
	}
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
