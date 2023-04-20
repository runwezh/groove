<script>
	import Note from "$components/Circle.Note.svelte";
	import { onDestroy, setContext } from "svelte";
	import { scaleLinear, range, arc } from "d3";
	import { tweened } from "svelte/motion";
	import Range from "$components/helpers/Range.svelte";
	import _ from "lodash";
	import { writable } from "svelte/store";

	export let dots;
	export let beatsPerRotation = 1;
	export let division;
	export let bpm = 60;
	export let interactive;

	setContext("song", {
		beatsPerRotation,
		division,
		getT: () => t,
		getAngleScale: () => angleScale,
		getCycleDuration: () => duration,
		getIsPlaying: () => isPlaying
	});

	let currentDivision = division;
	let interval;
	const t = tweened(0);
	const height = 450;
	const start = 0;
	const circleR = height / 2 - 100;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);
	const isPlaying = writable(false);

	$: ratio = Math.ceil(currentDivision / 2) / currentDivision;
	$: dotsData = interactive ? [0, ratio] : dots ? dots.map((d) => +d) : [];
	$: end = beatsPerRotation;
	$: percentageArc = arc()
		.innerRadius(0)
		.outerRadius(circleR)
		.startAngle(angleScale(dotsData[0]) + Math.PI / 2)
		.endAngle(angleScale(dotsData[dotsData.length - 1]) + Math.PI / 2);
	$: duration = (60000 * beatsPerRotation) / bpm;
	$: angleScale = scaleLinear()
		.domain([0, end])
		.range([-Math.PI / 2, (3 / 2) * Math.PI]); // to make 0 at the top

	const pause = () => {
		$isPlaying = false;
		clearInterval(interval);
		t.set(end, { duration: 0 });
	};
	const play = () => {
		$isPlaying = true;
		t.set(start, { duration: 0 });
		t.set(end, { duration });
		interval = setInterval(() => {
			t.set(start, { duration: 0 });
			t.set(end, { duration });
		}, duration);
	};

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<svg width={"100%"} {height}>
	<circle id="outer" r={circleR} cx={"50%"} cy={"50%"} />

	<path
		fill="lightgrey"
		d={percentageArc()}
		style:transform="translate(50%, 50%)"
	/>

	{#if division}
		{#each range(0, 1, 1 / currentDivision) as i}
			<line
				x1={0}
				y1={0}
				x2={circleR * Math.cos(angleScale(i))}
				y2={circleR * Math.sin(angleScale(i))}
				style:transform="translate(50%, 50%)"
			/>
		{/each}
	{/if}

	<line
		id="marker"
		x1={0}
		y1={0}
		x2={x(angleScale($t))}
		y2={y(angleScale($t))}
		style:transform="translate(50%, 50%)"
	/>

	{#each dotsData as dot, i}
		{@const cx = x(angleScale(dot))}
		{@const cy = y(angleScale(dot))}
		{@const otherDot = i === 0 ? dotsData[1] : dotsData[0]}
		{@const playing = dot >= $t && otherDot < $t}
		<Note note={dot} {cx} {cy} {playing} />
	{/each}
</svg>

{#if interactive}
	<div class="interactive">
		<div class="labels">
			<div>swing percentage</div>
			<div>divide the beat in</div>
		</div>
		<div class="slider">
			<Range
				min={1}
				max={11}
				step={2}
				showTicks={true}
				ticksAbove={range(1, 12, 2).map(
					(d) => `${_.round((Math.ceil(d / 2) / d) * 100, 1)}%`
				)}
				bind:value={currentDivision}
			/>
		</div>
	</div>
{/if}

<p>{$t.toFixed(2)}</p>
<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
	.interactive {
		display: flex;
		width: 100%;
		align-items: flex-start;
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
	svg {
		background: var(--color-gray-100);
	}
	#outer {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
		fill: none;
	}
	line {
		stroke: var(--color-gray-400);
		stroke-width: 1px;
		stroke-dasharray: 10px;
	}
	#marker {
		stroke: var(--color-gray-800);
		stroke-width: 4px;
		stroke-dasharray: 0px;
	}
</style>
