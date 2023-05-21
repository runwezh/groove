<script>
	import Note from "$components/Circle.Note.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { setContext } from "svelte";
	import { scaleLinear, range, arc } from "d3";
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
		getCurrentBeat: () => currentBeat,
		getIsPlaying: () => isPlaying
	});

	const options = [3, 5, 7, 9];
	const height = 300;
	const padding = 30;
	const circleR = height / 2 - padding;
	const x = (theta) => circleR * Math.cos(theta);
	const y = (theta) => circleR * Math.sin(theta);
	const isPlaying = writable(false);
	const seek = writable(0);
	const currentBeat = writable(0);

	let d;
	let duration = 0;
	let audioEls = [];
	let currentDivision = +division;

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
	$: duration = d - 0.7;
	$: $currentBeat = timeToBeat($seek) % beatsPerRotation;
	$: if ($seek >= duration) {
		reset();
		play();
	}
	$: division, divisionChange();

	const divisionChange = () => {
		audioEls.forEach((el) => {
			el.currentTime = $seek;
		});
	};

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

<div class="circle-wrapper">
	<button on:click={$isPlaying ? pause : play}>
		{#if $isPlaying}
			<Icon name="pause" />
		{:else}
			<Icon name="play" />
		{/if}
	</button>

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
	button {
		height: 2.5em;
		width: 2.7em;
	}
</style>
