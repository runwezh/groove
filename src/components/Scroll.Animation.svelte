<script>
	import WavyLine from "$components/Scroll.WavyLine.svelte";
	import SimpleDemo from "$components/Scroll.SimpleDemo.svelte";
	import { scrollyStep, direction, soundOn } from "$stores/misc.js";
	import { scaleLinear, range } from "d3";

	const yOffset = 150;
	let beats = 32;
	let width = 0;
	let normalEl;
	let drunkEl;
	let normalSeek = 0;
	let drunkSeek = 0;

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

	$: visible = $scrollyStep !== undefined || $direction === "up";
	$: moving =
		$scrollyStep !== 2 &&
		$scrollyStep !== 3 &&
		($scrollyStep !== undefined || $direction === "up");
	$: data =
		$scrollyStep === 2
			? range(8, 32, 2)
			: $scrollyStep === 3
			? [
					0, 2.5, 3, 3.2, 5, 9, 10, 11, 12, 13.5, 13.7, 13.8, 15, 18, 18.5,
					18.7, 20, 22, 25, 27, 28, 28.5, 28.9, 30
			  ]
			: [];

	$: xScale = scaleLinear().domain([0, beats]).range([0, width]);
	$: timeToBeat = scaleLinear().domain([0, currentDuration]).range([0, beats]);

	let speed = 1;
</script>

<div class="wrapper" bind:clientWidth={width} class:visible>
	<svg>
		<g transform={`translate(0, ${yOffset})`}>
			<WavyLine {width} {moving} />
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
		transition: opacity 800ms;
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
