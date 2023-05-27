<script>
	import Marker from "$components/Demo.Marker.svelte";
	import Row from "$components/Demo.Row.svelte";
	import Audio from "$components/Demo.Audio.svelte";
	import Annotations from "$components/Demo.Annotations.svelte";
	import Descriptions from "$components/Demo.Descriptions.svelte";
	import { setContext, onMount, tick } from "svelte";
	import { scaleLinear, range } from "d3";
	import { writable } from "svelte/store";
	import { songData, currentAudioId } from "$stores/misc.js";
	import viewport from "$stores/viewport.js";
	import inView from "$actions/inView.js";
	import _ from "lodash";

	export let songId;
	export let notes = [];
	export let style = "default";
	export let song;
	export let artist;
	export let year;

	const {
		parts,
		defaultStyles,
		actionsData,
		beatsPerMeasure = 4,
		measures = 1,
		highlighted = {},
		gridlines = true,
		marker = true,
		autoplay = false
	} = $songData[songId];

	setContext("song", {
		songId,
		beatsPerMeasure,
		gridlines,
		autoplay,
		getDuration: () => duration,
		getTrimmedDuration: () => trimmedDuration,
		getCurrentBeat: () => currentBeat,
		getTimeToBeat: () => timeToBeat,
		getXScale: () => xScale,
		getInstrumentStyles: () => instrumentStyles,
		getHighlightedNotes: () => highlightedNotes,
		getIsPlaying: () => isPlaying,
		getAllParts: () => allParts,
		getAudioEls: () => audioEls,
		getSeek: () => seek,
		getWidth: () => width,
		getHeight: () => height,
		getXOffset: () => xOffset,
		getInteractionHeight: () => interactionHeight,
		getPlayClicked: () => playClicked,
		getCurrentAction: () => currentAction,
		getCurrentActionIndex: () => currentActionIndex,
		getActions: () => actions,
		style,
		song,
		artist
	});

	const audioEls = writable([]);
	const duration = writable(0);
	const trimmedDuration = writable(0);
	const seek = writable(0);
	const allParts = writable(parts);
	const currentBeat = writable(0);
	const timeToBeat = writable(undefined);
	const xScale = writable(undefined);
	const actions = writable(actionsData.map((d) => ({ ...d, on: false })));
	const instrumentStyles = writable({ ...defaultStyles });
	const highlightedNotes = writable(highlighted);
	const isPlaying = writable(false);
	const width = writable(0);
	const height = writable(0);
	const xOffset = writable(0);
	const interactionHeight = writable(0);
	const playClicked = writable(false);
	const currentAction = writable(undefined);
	const currentActionIndex = writable(undefined);
	const order = ["bass", "synth", "hihat", "kick", "snare"];
	let caption = { song: "", info: "" };

	const reset = () => {
		$seek = 0;
	};
	const play = async () => {
		$audioEls.forEach((el) => {
			el.currentTime = $seek;
		});
		$audioEls.forEach((el) => {
			el.play();
		});
		if (!$playClicked) {
			$playClicked = true;
			$currentAction = $actions[0];
			$currentActionIndex = 0;
		}
		$isPlaying = true;
		$currentAudioId = songId;
	};
	const pause = () => {
		$isPlaying = false;
		$audioEls.forEach((el) => el.pause());
		$currentAudioId = undefined;
	};
	const restartActions = () => {
		$actions = $actions.map((d) => ({ ...d, on: false }));
		$currentAction = $actions[0];
		$currentActionIndex = 0;
		$highlightedNotes = [];
		$instrumentStyles = { ...defaultStyles };
		reset();
	};

	const onExit = () => {
		pause();
		reset();
	};

	const simplify = (instrument, style) => {
		if (style === "straight" || style === "missing") {
			return style;
		} else if (instrument === "snare") {
			return "shifted";
		} else {
			return "swung";
		}
	};

	$: $timeToBeat = scaleLinear()
		.domain([0, $trimmedDuration])
		.range([0, beatsPerMeasure * measures]);
	$: $currentBeat = $timeToBeat($seek * 1000) % beatsPerMeasure;
	$: $xScale = scaleLinear().domain([0, beatsPerMeasure]).range([0, $width]);
	$: sortedInstruments = _.orderBy(
		_.uniq($allParts.map((d) => d.instrument)),
		(d) => order.indexOf(d)
	);
	$: faded = style !== "real" && !$playClicked;
	$: {
		const instruments = order
			.filter(
				(d) => $instrumentStyles[d] && (songId !== "money" || d !== "kick")
			)
			.map((d) => `the ${d} is ${simplify(d, $instrumentStyles[d])}`);
		const info = instruments.join(", ");

		if (style !== "real") {
			caption = { song: "a basic groove", info };
		} else {
			caption = { song: `${song} by ${artist}`, info };
		}
	}
	$: figcaption = `visualizing each part of ${caption.song} where ${caption.info}.`;
	$: if ($viewport.height && $viewport.width) measure();

	const measure = async () => {
		await tick();
		const noteEl = document.querySelector(
			"div#straight-demo figure .instrument .notes"
		);
		if (noteEl) $width = noteEl.clientWidth;
		const instrumentEl = document.querySelector(
			"div#straight-demo figure .instrument"
		);
		if (instrumentEl) $interactionHeight = instrumentEl.clientHeight;
	};

	onMount(() => {
		measure();
	});
</script>

<div id={`${songId}-demo`} class="demo" class:real={style === "real"}>
	{#if song && artist}
		<h3><span>{song}</span> by <span>{artist}</span> ({year})</h3>
	{/if}

	<div class="descriptions" class:faded>
		<Descriptions {notes} />
	</div>

	<figure bind:clientHeight={$height} class:faded use:inView on:exit={onExit}>
		<figcaption class="sr-only" aria-live="polite">{figcaption}</figcaption>

		{#if marker}
			<Marker />
		{/if}

		{#if gridlines}
			<div
				class="grid"
				style:width={`${$width}px`}
				style:left={`${$xOffset}px`}
			>
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

		{#each sortedInstruments as instrument}
			{@const data = $allParts.find(
				(d) =>
					d.instrument === instrument &&
					d.style === $instrumentStyles[instrument]
			)?.data}
			{@const action = $actions
				? $actions.find((d) => d.instrument === instrument)
				: null}
			<Row id={instrument} {data} {action} />
		{/each}

		{#if style === "real"}
			<Annotations />
		{/if}
	</figure>

	<Audio {play} {pause} {reset} {restartActions} />
</div>

<style>
	.demo {
		padding: 1.5em;
		background: var(--color-gray-900);
		position: relative;
		margin: 2em 0;
	}
	.demo.real {
		background: none;
	}
	figure {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
		opacity: 1;
		transition: opacity calc(var(--1s) * 0.3);
	}
	.descriptions {
		opacity: 1;
		transition: opacity calc(var(--1s) * 0.3);
	}
	.faded {
		opacity: 0.2;
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
		opacity: 0.6;
		width: 1px;
		position: absolute;
		z-index: 0;
		transform: translate(-50%, 0);
	}
	h3 span {
		font-weight: bold;
	}
</style>
