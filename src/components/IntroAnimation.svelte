<script>
	import WavyLine from "$components/IntroAnimation.WavyLine.svelte";
	import SimpleDemo from "$components/IntroAnimation.SimpleDemo.svelte";
	import { scrollyStep, direction, soundOn } from "$stores/misc.js";
	import { scaleLinear, range } from "d3";
	import mq from "$stores/mq.js";

	let beats = 32;
	let width = 0;
	let normalEl;
	let drunkEl;
	let normalSeek = 0;
	let drunkSeek = 0;
	let speed = 1;

	const yOffset = 150;
	const straightData = range(8, 32, 2);
	const wonkyData = [
		0.2, 1.44, 1.51, 1.8, 2.1, 2.4, 3.4, 4.2, 5.3, 5.5, 6.3, 6.6, 6.8, 7.1, 7.2,
		7.7, 8.6, 9.3, 9.5, 9.67
	].map((d) => d * (beats / 9.937958));

	$: if (normalPlaying) normalSeek = 0;
	$: if (drunkPlaying) drunkSeek = 0;

	$: normalPlaying = $scrollyStep === 2;
	$: drunkPlaying = $scrollyStep === 1 || $scrollyStep === 3;
	$: normalPaused = !normalPlaying;
	$: drunkPaused = !drunkPlaying;

	$: currentSeek = normalPlaying ? normalSeek : drunkPlaying ? drunkSeek : 0;
	$: currentDuration = normalPlaying
		? normalEl.duration - 2
		: drunkPlaying
		? drunkEl.duration - 2
		: 0;
	$: currentBeat = timeToBeat(currentSeek);

	$: visible = $scrollyStep !== undefined;
	$: moving =
		$scrollyStep !== 2 &&
		$scrollyStep !== 3 &&
		($scrollyStep !== undefined || $direction === "up") &&
		!$mq.reducedMotion;
	$: data =
		$scrollyStep === 2 ? straightData : $scrollyStep === 3 ? wonkyData : [];

	$: xScale = scaleLinear().domain([0, beats]).range([0, width]);
	$: timeToBeat = scaleLinear().domain([0, currentDuration]).range([0, beats]);
	$: drunkVolume = $scrollyStep === 1 ? 0.5 : 1;
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

<audio
	bind:this={normalEl}
	bind:currentTime={normalSeek}
	bind:paused={normalPaused}
	src={"assets/sound/intro/normal.mp3"}
	loop={true}
	muted={!$soundOn}
	preload="auto"
/>
<audio
	bind:this={drunkEl}
	bind:currentTime={drunkSeek}
	bind:paused={drunkPaused}
	bind:playbackRate={speed}
	src={"assets/sound/intro/drunk.mp3"}
	loop={true}
	muted={!$soundOn}
	preload="auto"
	bind:volume={drunkVolume}
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
