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
		getIsPlaying: () => isPlaying,
		getData: () => data,
		getSeek: () => seek,
		getWidth: () => width,
		getHeight: () => height,
		getXOffset: () => xOffset
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

	{#if gridlines}
		<!-- <div class="grid">
			{#each range(0, beatsPerMeasure) as bar}
				{@const thick = bar % 1 === 0}
				{@const left = $xScale(bar)}

				<div class="line" class:thick style:left={`${left}px`} />
			{/each}
		</div> -->
	{/if}

	{#each _.orderBy(Object.keys($data)) as instrument, i}
		<Instrument data={$data[instrument]} id={instrument} />
	{/each}
</div>

{#if !autoplay}
	<button on:click={play}><Icon name="play" color="black" size="100%" /></button
	>
	<button on:click={pause}
		><Icon name="pause" color="black" size="100%" /></button
	>
{/if}

<style>
	audio {
		display: none;
	}
	button {
		background: var(--color-gray-100);
		color: black;
		width: 50px;
		height: 50px;
	}
	.chart {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
	}
</style>
