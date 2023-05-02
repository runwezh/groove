<script>
	import Marker from "$components/Song.Marker.svelte";
	import Instrument from "$components/Song.Instrument.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { onMount, setContext } from "svelte";
	import { scaleLinear, range } from "d3";
	import { writable } from "svelte/store";
	import { songData } from "$stores/misc.js";
	import _ from "lodash";

	export let songId;

	const {
		data: d = {},
		actions,
		beatsPerMeasure = 4,
		measures = 1,
		gridlines = true,
		marker = true,
		autoplay = false
	} = $songData[songId];

	let audioEl;
	let duration;

	setContext("song", {
		songId,
		beatsPerMeasure,
		getCurrentBeat: () => currentBeat,
		getTimeToBeat: () => timeToBeat,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getHighlightedNotes: () => highlightedNotes,
		getIsPlaying: () => isPlaying,
		getData: () => data,
		getSeek: () => seek,
		getWidth: () => width,
		getHeight: () => height,
		getXOffset: () => xOffset,
		gridlines
	});

	const seek = writable(0);
	const data = writable(d);
	const currentBeat = writable(0);
	const timeToBeat = writable(undefined);
	const xScale = writable(undefined);
	const instrumentToggles = writable({
		hihat: "on",
		snare: "on",
		kick: "on"
	});
	const highlightedNotes = writable({});
	const isPlaying = writable(false);
	const width = writable(0);
	const height = writable(0);
	const xOffset = writable(0);

	const reset = () => {
		audioEl.currentTime = 0;
	};

	$: trimmedDuration = duration * 1000 - 1500;
	$: if (duration && $seek * 1000 > trimmedDuration) reset();
	$: $timeToBeat = scaleLinear()
		.domain([0, trimmedDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $xScale = scaleLinear().domain([0, beatsPerMeasure]).range([0, $width]);

	const play = () => {
		$isPlaying = true;
		audioEl.play();
	};
	const pause = () => {
		$isPlaying = false;
		audioEl.pause();
	};

	onMount(() => {
		if (autoplay) {
			play();
		}
	});
</script>

<audio
	bind:this={audioEl}
	bind:duration
	src={`assets/sound/${songId}.mp3`}
	bind:currentTime={$seek}
/>

<!-- <p>{$seek.toFixed(2)}s</p>
<p>beat: {$currentBeat.toFixed(2)}</p> -->

<div class="chart" bind:clientHeight={$height}>
	{#if marker}
		<Marker />
	{/if}

	{#each _.orderBy(Object.keys($data)) as instrument, i}
		{@const action = actions
			? actions.find((d) => d.instrument === instrument)
			: null}
		<Instrument instrumentData={$data[instrument]} id={instrument} {action} />
	{/each}
</div>

{#if !autoplay}
	<button on:click={play}>play</button>
	<button on:click={pause}>pause</button>
{/if}

<style>
	audio {
		display: none;
	}
	button {
		margin-right: 0.8em;
	}
	.chart {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
	}
</style>
