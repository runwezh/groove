<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { tweened } from "svelte/motion";
	import { scaleLinear, scaleSequential } from "d3";

	export let data;
	export let id;
	export let i;

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

	$: if (playing) playNote();
	const playNote = () => {
		if (sounds[id].state() === "loaded") sounds[id].play();
	};

	const gap = data[1] - data[0];
	const leftSide = 10;
	const rightSide = 400 - 10 - 25;
	const xScale = scaleLinear()
		.domain([data[0], data[1]])
		.range([leftSide, rightSide]);

	$: tValue =
		$t % (gap * 2) >= data[0] && $t % (gap * 2) <= data[1]
			? $t % (gap * 2)
			: flip($t % (gap * 2));

	const flip = (n) => {
		if (n > data[1]) {
			return data[1] - (n - data[1]);
		} else {
			return data[0] + (data[0] - n);
		}
	};

	$: x = xScale(tValue);
</script>

<div class="wall left" />
<div class="wall right" />

<div class="ball" style={`--x: ${x}px`} />

<!-- <p>{tValue}</p> -->
<style>
	.ball {
		height: 50px;
		width: 50px;
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
	}
	.right {
		position: absolute;
		left: 400px;
	}
</style>
