<script>
	import Note from "$components/Circle.Note.svelte";
	import { onDestroy, setContext } from "svelte";
	import { scaleLinear, range, arc } from "d3";
	import { tweened } from "svelte/motion";
	import Range from "$components/helpers/Range.svelte";
	import _ from "lodash";
	import { writable } from "svelte/store";

	export let dots = [0];
	export let beatsPerRotation = 1;
	export let division = 3;
	export let interactive;
	export let measures = 4;
	export let beatsPerMeasure = 4;

	setContext("song", {
		beatsPerRotation,
		division,
		getSeek: () => seek,
		getCurrentBeat: () => currentBeat,
		getIsPlaying: () => isPlaying
	});

	const seek = writable(0);
	let audioEls = [];
	let currentDivision = +division;
	const height = 450;
	const circleR = height / 2 - 100;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);
	const isPlaying = writable(false);
	const currentBeat = writable(0);
	const options = [3, 5, 7, 9, 11];
	let d;
	let duration = 0;

	$: ratio = Math.ceil(currentDivision / 2) / currentDivision;
	$: dotsData = interactive ? [0, ratio] : dots ? dots.map((d) => +d) : [];
	$: percentageArc = arc()
		.innerRadius(0)
		.outerRadius(circleR)
		.startAngle(beatToAngle(dotsData[0]) + Math.PI / 2)
		.endAngle(beatToAngle(dotsData[dotsData.length - 1]) + Math.PI / 2);
	$: timeToBeat = scaleLinear()
		.domain([0, duration / measures / beatsPerMeasure || 0])
		.range([0, beatsPerRotation]);
	$: beatToAngle = scaleLinear()
		.domain([0, beatsPerRotation])
		.range([-Math.PI / 2, (3 / 2) * Math.PI]); // to make 0 at the top
	$: duration = d - 1.3;
	$: $currentBeat = timeToBeat($seek) % beatsPerRotation;
	$: if ($seek >= duration) {
		reset();
		play();
	}

	const pause = () => {
		$isPlaying = false;
		audioEls.forEach((el) => el.pause());
	};
	const play = () => {
		$isPlaying = true;
		audioEls.forEach((el) => {
			el.currentTime = $seek;
			el.play();
		});
	};
	const reset = () => {
		$seek = 0;
	};
</script>

<svg width={"100%"} {height}>
	<g style:transform={`translate(50%, 50%)`}>
		<circle id="outer" r={circleR} />

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
			id="marker"
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
				max={11}
				step={2}
				showTicks={true}
				ticksAbove={options.map(
					(d) => `${_.round((Math.ceil(d / 2) / d) * 100, 1)}%`
				)}
				bind:value={currentDivision}
			/>
		</div>
	</div>
{/if}

<button on:click={play}>play</button>
<button on:click={pause}>pause</button>

{#each options.slice(0, 2) as option, i}
	{#if i === 0}
		<audio
			bind:this={audioEls[i]}
			bind:currentTime={$seek}
			bind:duration={d}
			src={`assets/sound/swing-percentage/${option}.mp3`}
			muted={option !== currentDivision}
		/>
	{:else}
		<audio
			bind:this={audioEls[i]}
			currentTime={$seek}
			src={`assets/sound/swing-percentage/${option}.mp3`}
			muted={option !== currentDivision}
		/>
	{/if}
{/each}

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
	#outer {
		stroke: var(--color-gray-100);
		stroke-width: 1px;
		fill: none;
	}
	line {
		stroke: var(--color-gray-100);
		stroke-width: 1px;
		stroke-dasharray: 10px;
	}
	#marker {
		stroke: var(--color-gray-100);
		stroke-width: 4px;
		stroke-dasharray: 0px;
	}
	.percentage {
		fill: var(--accent);
		opacity: 0.5;
	}
</style>
