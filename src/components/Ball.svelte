<script>
	import { Howl } from "howler";
	import { getContext, onMount, tick } from "svelte";
	import { tweened } from "svelte/motion";
	import { scaleLinear, scaleSequential } from "d3";

	export let data;
	export let id;
	export let simulationOn;

	const { getT, beatsPerRotation, getCycleDuration } = getContext("song");
	const t = getT();
	const duration = getCycleDuration();
	$: msInBeat = duration / beatsPerRotation;

	const buffer = 0.05;
	$: playing = data.some((d) => $t >= d && $t < d + buffer);

	const sounds = {
		hihat: new Howl({
			src: ["assets/sound/hihat.mp3"]
		}),
		kick: new Howl({
			src: ["assets/sound/kick.mp3"]
		}),
		snare: new Howl({
			src: ["assets/sound/snare.mp3"]
		})
	};

	$: intervals = [
		...data.map((d, i) => (i > 0 ? d - data[i - 1] : d)).slice(1),
		4 + data[0] - data[data.length - 1]
	];
	$: durations = intervals.map((d) => d * msInBeat);
	// $: distances = intervals.map((d) => 200 * d);

	const ballWidth = 40;
	const wallWidth = 10;
	let i = 0;
	let direction = 1; // -1 for left
	$: currentInterval = intervals[i];
	$: currentDuration = durations[i];
	// $: currentDistance = distances[i];

	const distance = id === "hihat" ? 130 : 400;

	$: x = tweened(wallWidth);
	$: if (simulationOn) start();

	const start = async () => {
		await tick();

		x.set(
			direction === 1 ? $x + distance - ballWidth : $x - distance + ballWidth,
			{
				duration: currentDuration
			}
		).then(() => {
			sounds[id].play();
			next();
		});
	};

	const next = () => {
		if (i < intervals.length - 1) {
			i++;
		} else {
			i = 0;
		}
		direction *= -1;
		start();
	};
</script>

<div class="wall left" />
<div class="wall right" style={`--left: ${distance}px`} />

<div class="ball" style={`--x: ${$x}px`} />

<style>
	.ball {
		height: 40px;
		width: 40px;
		background-color: red;
		border-radius: 50%;
		position: absolute;
		bottom: 0px;
		left: var(--x);
	}
	.wall {
		height: 100%;
		width: 10px;
		background-color: black;
		transition: all 500ms;
	}
	.right {
		margin-left: var(--left);
	}
</style>
