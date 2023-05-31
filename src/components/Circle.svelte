<script>
	import Track from "$components/Circle.Track.svelte";
	import Note from "$components/Circle.Note.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { setContext } from "svelte";
	import { scaleLinear, range, arc } from "d3";
	import Range from "$components/helpers/Range.svelte";
	import _ from "lodash";
	import { writable } from "svelte/store";
	import { currentAudioId } from "$stores/misc.js";
	import mq from "$stores/mq.js";
	import { previous } from "$stores/previous.js";

	export let dots = [0];
	export let beatsPerRotation = 1;
	export let division = 3;
	export let interactive;
	export let measures = 4;
	export let beatsPerMeasure = 4;

	setContext("song", {
		getCurrentBeat: () => currentBeat,
		getIsPlaying: () => isPlaying,
		getAudioEls: () => audioEls,
		getDuration: () => duration,
		getCurrentTrackI: () => currentTrackI,
		getSeek: () => seek
	});

	const height = 300;
	const padding = 30;
	const circleR = height / 2 - padding;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);
	const isPlaying = writable(false);
	const seek = writable(0);
	const currentBeat = writable(0);
	const audioEls = writable([]);
	const duration = writable(0);
	const currentTrackI = writable(0);
	const prevTrackI = previous(currentTrackI);

	let currentDivision = +division;
	let id = interactive ? "circle-interactive" : "circle";

	$: $currentTrackI = options.findIndex((d) => d === currentDivision);
	$: options = interactive ? [3, 5, 7, 9] : [currentDivision];
	$: ratio = Math.ceil(currentDivision / 2) / currentDivision;
	$: dotsData = interactive ? [0, ratio] : dots ? dots.map((d) => +d) : [];
	$: percentageArc = arc()
		.innerRadius(0)
		.outerRadius(circleR)
		.startAngle(beatToAngle(dotsData[0]) + Math.PI / 2)
		.endAngle(beatToAngle(dotsData[dotsData.length - 1]) + Math.PI / 2);
	$: timeToBeat = scaleLinear()
		.domain([0, trimmedDuration / measures / beatsPerMeasure || 0])
		.range([0, beatsPerRotation]);
	$: beatToAngle = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([-Math.PI / 2, (3 / 2) * Math.PI]); // to make 0 at the top
	$: trimmedDuration = $duration - 0.7;
	$: $currentBeat = timeToBeat($seek) % beatsPerRotation;
	$: if ($seek >= trimmedDuration && $isPlaying) {
		reset();
		play();
	}
	$: $currentTrackI, divisionChange();
	$: $currentAudioId, audioChange();
	const audioChange = () => {
		if ($currentAudioId && $currentAudioId !== id && $isPlaying) {
			pause();
		}
	};

	const divisionChange = () => {
		if ($audioEls.length) {
			$audioEls[$prevTrackI].pause();
			const prevTime = $audioEls[$prevTrackI].currentTime;
			$audioEls[$prevTrackI].currentTime = 0;

			$audioEls[$currentTrackI].currentTime = prevTime;
			$audioEls[$currentTrackI].play();
		}
	};

	const pause = () => {
		$isPlaying = false;
		$currentAudioId = undefined;
		if ($audioEls.length) $audioEls[$currentTrackI].pause();
	};
	const play = () => {
		$isPlaying = true;
		$currentAudioId = id;
		if ($audioEls.length) $audioEls[$currentTrackI].play();
	};
	const reset = () => {
		if ($audioEls.length) $audioEls[$currentTrackI].currentTime = 0;
	};
</script>

<div class="circle-wrapper">
	<button
		on:click={$isPlaying ? pause : play}
		aria-label={$isPlaying ? "pause" : "play"}
	>
		{#if $isPlaying}
			<Icon name="pause" />
		{:else}
			<Icon name="play" />
		{/if}
	</button>

	<svg width={"100%"} {height}>
		<g style:transform={`translate(50%, 50%)`}>
			<circle class="outer" r={circleR} />

			<path class="percentage" d={percentageArc()} />

			{#if division}
				{#each range(0, 1, 1 / currentDivision) as i}
					<line
						x1={0}
						y1={0}
						x2={circleR * Math.cos(beatToAngle(i))}
						y2={circleR * Math.sin(beatToAngle(i))}
					/>
				{/each}
			{/if}

			<line
				class="marker"
				class:visible={!$mq.reducedMotion}
				x1={0}
				y1={0}
				x2={x(beatToAngle(timeToBeat($seek)))}
				y2={y(beatToAngle(timeToBeat($seek)))}
			/>

			{#each dotsData as dot, i}
				{@const cx = x(beatToAngle(dot))}
				{@const cy = y(beatToAngle(dot))}
				<Note note={dot} {cx} {cy} />
			{/each}
		</g>
	</svg>

	{#if interactive}
		<div class="interactive">
			<div class="labels">
				<div>swing percentage</div>
				<div>divide the beat in</div>
			</div>
			<div class="slider">
				<Range
					min={3}
					max={9}
					step={2}
					showTicks={true}
					ticksAbove={options.map(
						(d) => `${_.round((Math.ceil(d / 2) / d) * 100, 1)}%`
					)}
					bind:value={currentDivision}
					dotColor={"var(--accent-light)"}
				/>
			</div>
		</div>
	{/if}
</div>

{#each options as option, i}
	{@const src = `assets/sound/swing-percentage/${option}.mp3`}

	<Track {i} {src} />
{/each}

<style>
	.circle-wrapper {
		margin: 2em 0;
	}
	.interactive {
		display: flex;
		width: 100%;
		align-items: flex-start;
		margin-top: 2em;
		margin-bottom: 1em;
	}
	.labels {
		margin-right: 2em;
		font-size: 14px;
	}
	.labels div:first-child {
		transform: translate(0, -100%);
	}
	.slider {
		flex: 1;
	}
	.outer {
		stroke: var(--color-gray-100);
		stroke-width: 1px;
		fill: none;
	}
	line {
		stroke: var(--color-gray-100);
		stroke-width: 1px;
		stroke-dasharray: 10px;
	}
	.marker {
		stroke: var(--color-gray-100);
		stroke-width: 4px;
		stroke-dasharray: 0px;
		visibility: hidden;
	}
	.marker.visible {
		visibility: visible;
	}
	.percentage {
		fill: var(--accent);
		opacity: 0.5;
	}
	button {
		height: 2.5em;
		width: 2.7em;
	}
</style>
