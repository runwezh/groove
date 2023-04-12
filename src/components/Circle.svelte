<script>
	import Note from "$components/Circle.Note.svelte";
	import { onDestroy, setContext } from "svelte";
	import viewport from "$stores/viewport.js";
	import { scaleLinear, range, arc } from "d3";
	import { tweened } from "svelte/motion";
	import Range from "$components/helpers/Range.svelte";

	export let dots;
	export let beatsPerRotation = 1;
	export let division;
	export let bpm = 60;
	export let interactive;

	$: dotsData = interactive
		? [0, 1 / sliderValue] // TODO: make this right (maybe make the slider value the swing %)
		: dots
		? dots.map((d) => +d)
		: [];

	setContext("song", {
		beatsPerRotation,
		division,
		getT: () => t,
		getAngleScale: () => angleScale,
		getCycleDuration: () => duration
	});

	let sliderValue = division;
	let interval;
	const t = tweened(0);
	const height = 450;
	const start = 0;
	const circleR = height / 2 - 100;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);

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
		clearInterval(interval);
		t.set(end, { duration: 0 });
	};
	const play = () => {
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
		{#each range(0, 1, 1 / sliderValue) as i}
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

	{#each dotsData as dot}
		{@const cx = x(angleScale(dot))}
		{@const cy = y(angleScale(dot))}
		<Note note={dot} {cx} {cy} />
	{/each}
</svg>

{#if interactive}
	<Range min={1} max={10} step={1} showTicks={true} bind:value={sliderValue} />
{/if}

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

<style>
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
