<script>
	import Marker from "$components/Song.Marker.svelte";
	import Instrument from "$components/Song.Instrument.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { onMount, setContext } from "svelte";
	import { scaleLinear, range } from "d3";
	import { writable } from "svelte/store";
	import { songData, soundOn } from "$stores/misc.js";
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

	let audioEls = [];
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
		kick: "on",
		bass: "on"
	});
	const highlightedNotes = writable({});
	const isPlaying = writable(false);
	const width = writable(0);
	const height = writable(0);
	const xOffset = writable(0);

	const reset = () => {
		audioEls.forEach((el) => {
			el.currentTime = 0;
		});
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
		audioEls.forEach((el) => {
			el.currentTime = $seek;
			el.play();
		});
	};
	const pause = () => {
		$isPlaying = false;
		audioEls.forEach((el) => el.pause());
	};

	onMount(() => {
		if (autoplay) {
			play();
		}
	});
</script>

<!-- TODO: these should happen inside <Instrument/>. Pass up values by context. That way, we can change songId -> style and each instrument can track their style. -->

{#each songId === "normal" || songId === "drunk" ? ["kick"] : ["bass", "hihat", "kick", "snare"] as part, i}
	{#if i === 0}
		<!-- leader -->
		<audio
			bind:this={audioEls[i]}
			bind:duration
			src={`assets/sound/${songId}/${part}.mp3`}
			bind:currentTime={$seek}
			muted={!$soundOn || $instrumentToggles[part] === "off"}
		/>
	{:else}
		<!-- followers -->
		<audio
			bind:this={audioEls[i]}
			src={`assets/sound/${songId}/${part}.mp3`}
			muted={!$soundOn || $instrumentToggles[part] === "off"}
		/>
	{/if}
{/each}

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
