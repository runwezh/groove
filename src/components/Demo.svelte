<script>
	import Marker from "$components/Demo.Marker.svelte";
	import Row from "$components/Demo.Row.svelte";
	import Audio from "$components/Demo.Audio.svelte";
	import { setContext } from "svelte";
	import { scaleLinear, range } from "d3";
	import { writable } from "svelte/store";
	import { songData } from "$stores/misc.js";
	import _ from "lodash";

	export let songId;
	export let showing = true;

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
		gridlines,
		autoplay,
		getVisible: () => visible,
		getDuration: () => duration,
		getTrimmedDuration: () => trimmedDuration,
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
		getPlayClicked: () => playClicked,
		getCurrentAction: () => currentAction,
		actions
	});

	const audioEls = writable([]);
	const duration = writable(0);
	const trimmedDuration = writable(0);
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
	const playClicked = writable(false);
	const currentAction = writable(undefined);
	const visible = writable(true);

	$: $visible = showing;
	$: $currentAction = actions && actions.length ? actions[0] : null;
	$: $timeToBeat = scaleLinear()
		.domain([0, $trimmedDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $xScale = scaleLinear().domain([0, beatsPerMeasure]).range([0, $width]);
</script>

<p>duration: {$duration?.toFixed(2)}s</p>

<div class="chart" bind:clientHeight={$height} class:visible={$visible}>
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

	{#each _.orderBy(_.uniq($allParts.map((d) => d.instrument))) as instrument, i}
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

<style>
	.chart {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
		visibility: hidden;
	}
	.chart.visible {
		visibility: visible;
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
