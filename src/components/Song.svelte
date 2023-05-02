<script>
	import Marker from "$components/Song.Marker.svelte";
	import Row from "$components/Song.Row.svelte";
	import Audio from "$components/Song.Audio.svelte";
	import { onMount, setContext } from "svelte";
	import { scaleLinear, range } from "d3";
	import { writable } from "svelte/store";
	import { songData } from "$stores/misc.js";
	import _ from "lodash";

	export let songId;

	const {
		parts,
		defaultStyles,
		actions,
		beatsPerMeasure = 4,
		measures = 1,
		gridlines = true,
		marker = true,
		autoplay = false
	} = $songData[songId];

	setContext("song", {
		songId,
		beatsPerMeasure,
		getDuration: () => duration,
		getCurrentBeat: () => currentBeat,
		getTimeToBeat: () => timeToBeat,
		getXScale: () => xScale,
		getInstrumentToggles: () => instrumentToggles,
		getInstrumentStyles: () => instrumentStyles,
		getHighlightedNotes: () => highlightedNotes,
		getIsPlaying: () => isPlaying,
		getAllParts: () => allParts,
		getAudioEls: () => audioEls,
		getSeek: () => seek,
		getWidth: () => width,
		getHeight: () => height,
		getXOffset: () => xOffset,
		gridlines
	});

	const audioEls = writable([]);
	const duration = writable(0);
	const seek = writable(0);
	const allParts = writable(parts);
	const currentBeat = writable(0);
	const timeToBeat = writable(undefined);
	const xScale = writable(undefined);
	const instrumentToggles = writable({
		bass: "on",
		kick: "on",
		snare: "on",
		hihat: "on"
	});
	const instrumentStyles = writable(defaultStyles);
	const highlightedNotes = writable({});
	const isPlaying = writable(false);
	const width = writable(0);
	const height = writable(0);
	const xOffset = writable(0);

	$: trimmedDuration = $duration * 1000 - 1500;
	$: if ($duration && $seek * 1000 > trimmedDuration) reset();
	$: $timeToBeat = scaleLinear()
		.domain([0, trimmedDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $xScale = scaleLinear().domain([0, beatsPerMeasure]).range([0, $width]);

	const reset = () => {
		$audioEls.forEach((el) => {
			el.currentTime = 0;
		});
	};
	const play = () => {
		$isPlaying = true;
		$audioEls.forEach((el) => {
			el.currentTime = $seek;
			el.play();
		});
	};
	const pause = () => {
		$isPlaying = false;
		$audioEls.forEach((el) => el.pause());
	};

	onMount(() => {
		if (autoplay) {
			play();
		}
	});
</script>

<div class="chart" bind:clientHeight={$height}>
	{#if marker}
		<Marker />
	{/if}

	{#if gridlines}
		<div class="grid" style:width={`${$width}px`} style:left={`${$xOffset}px`}>
			{#each range(0, beatsPerMeasure) as bar}
				{@const thick = bar % 1 === 0}
				{@const left = $xScale(bar)}
				<div
					class="line"
					class:thick
					style:left={`${left}px`}
					style:height={`${$height}px`}
				/>
			{/each}
		</div>
	{/if}

	{#each _.uniq($allParts.map((d) => d.instrument)) as instrument, i}
		{@const data = $allParts.find(
			(d) =>
				d.instrument === instrument && d.style === $instrumentStyles[instrument]
		)?.data}
		{@const action = actions
			? actions.find((d) => d.instrument === instrument)
			: null}
		<Row {i} id={instrument} {data} {action} />
	{/each}
</div>

<Audio />
{#if !autoplay}
	<button on:click={play}>play</button>
	<button on:click={pause}>pause</button>
{/if}

<style>
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
	.dot {
		background: var(--color-gray-200);
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 2.5px;
		transform: translate(-50%, -50%);
		z-index: -1;
	}
	.grid {
		position: absolute;
		top: 0;
	}
	.grid .line {
		background: var(--color-gray-200);
		width: 1px;
		position: absolute;
		z-index: -1;
		transform: translate(-50%, 0);
	}
</style>
