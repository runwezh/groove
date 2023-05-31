<script>
	import Track from "$components/IntroAnimation.Track.svelte";
	import WavyLine from "$components/IntroAnimation.WavyLine.svelte";
	import SimpleDemo from "$components/IntroAnimation.SimpleDemo.svelte";
	import { scrollyStep, direction } from "$stores/misc.js";
	import { scaleLinear, range } from "d3";
	import mq from "$stores/mq.js";

	let width = 0;
	let audioEls = [];
	let seek = 0;
	let durations = [];

	const yOffset = 150;
	const straightData = range(4, 28, 2);
	const wonkyData = [
		0.2, 1.44, 1.51, 1.8, 2.1, 2.4, 3.4, 4.2, 5.3, 5.5, 6.3, 6.6, 6.8, 7.1, 7.2,
		7.7, 8.6, 9.3, 9.5, 9.67
	].map((d) => d * (32 / 9.937958));

	$: normalPlaying = $scrollyStep === 2;
	$: drunkPlaying = $scrollyStep === 1 || $scrollyStep === 3;
	$: beats = normalPlaying ? 28 : 32;
	$: currentBeat = timeToBeat(seek);
	$: visible = $scrollyStep !== undefined;
	$: moving =
		$scrollyStep !== 2 &&
		$scrollyStep !== 3 &&
		($scrollyStep !== undefined || $direction === "up") &&
		!$mq.reducedMotion;
	$: data =
		$scrollyStep === 2 ? straightData : $scrollyStep === 3 ? wonkyData : [];

	$: xScale = scaleLinear().domain([0, beats]).range([0, width]);
	$: duration = normalPlaying
		? durations[0] - 1.2
		: drunkPlaying
		? durations[1] - 2
		: 0;
	$: timeToBeat = scaleLinear().domain([0, duration]).range([0, beats]);
</script>

<div class="wrapper" bind:clientWidth={width} class:visible>
	<svg>
		<g transform={`translate(0, ${yOffset})`}>
			{#if width}
				<WavyLine {width} {moving} />
			{/if}
			<SimpleDemo {data} {xScale} {currentBeat} />
		</g>
	</svg>
</div>

<Track
	i={0}
	src={"assets/sound/intro/normal.mp3"}
	bind:audioEls
	bind:seek
	bind:durations
	playing={normalPlaying}
/>
<Track
	i={1}
	src={"assets/sound/intro/drunk.mp3"}
	bind:audioEls
	bind:seek
	bind:durations
	playing={drunkPlaying}
/>

<style>
	.wrapper {
		visibility: visible;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.8);
	}
	svg {
		position: fixed;
		top: 20%;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.visible {
		opacity: 1;
	}
</style>
