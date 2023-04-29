<script>
	import Marker from "$components/Grid.Marker.svelte";
	import Instrument from "$components/Song.Instrument.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { onMount, setContext } from "svelte";
	import { scaleLinear, scaleBand, range } from "d3";
	import { writable } from "svelte/store";
	import _ from "lodash";

	export let id;
	export let beatsPerMeasure = 4;
	export let measures = 1;
	export let gridlines = true;
	export let marker = true;
	export let autoplay = false;

	let audioEl;
	let duration;
	let instrumentsWidth;

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
		getSeek: () => seek
	});

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

	const reset = () => {
		audioEl.currentTime = 0;
	};

	$: $data =
		id === "straight"
			? { kick: range(8, 32, 2) }
			: { kick: range(32).map((d) => d + _.random(-1, 1)) };
	$: trimmedDuration = duration * 1000 - 1500;
	$: if (duration && $seek * 1000 > trimmedDuration) reset();
	$: $timeToBeat = scaleLinear()
		.domain([0, trimmedDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $currentMeasure = Math.floor($timeToBeat($seek * 1000) / beatsPerMeasure);
	$: $xScale = scaleLinear()
		.domain([0, beatsPerMeasure])
		.range([0, instrumentsWidth]);

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
	src={`assets/sound/${id}.mp3`}
	bind:currentTime={$seek}
/>

<!-- <p>{$seek.toFixed(2)}s</p>
<p>beat: {$currentBeat.toFixed(2)}</p>
<p>measure: {$currentMeasure}</p> -->

<div class="container">
	<div class="instruments" bind:clientWidth={instrumentsWidth}>
		{#if marker}
			<Marker />
		{/if}

		{#if gridlines}
			<div class="grid">
				{#each range(0, beatsPerMeasure) as bar}
					{@const thick = bar % 1 === 0}
					{@const left = $xScale(bar)}

					<div class="line" class:thick style:left={`${left}px`} />
				{/each}
			</div>
		{/if}

		{#if instrumentsWidth}
			{#each Object.keys($data) as instrument, i}
				<Instrument data={$data[instrument]} id={instrument} />
			{/each}
		{/if}
	</div>
</div>

{#if !autoplay}
	<button on:click={play}><Icon name="play" color="white" size="100%" /></button
	>
	<button on:click={pause}
		><Icon name="pause" color="white" size="100%" /></button
	>
{/if}

<style>
	audio {
		display: none;
	}
	button {
		background: none;
		border: 3px solid white;
		width: 50px;
		height: 50px;
		border-radius: 25px;
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
