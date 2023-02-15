<script>
	import { onDestroy, onMount } from "svelte";
	import { Howl, Howler } from "howler";
	import { tweened } from "svelte/motion";
	import { scaleLinear } from "d3";

	export let ratio = 1;

	const kick = new Howl({
		src: ["assets/sound/kick.mp3"]
	});
	const snare = new Howl({
		src: ["assets/sound/snare.mp3"]
	});
	const stop = () => {
		pointX.set(-b / 2, { duration: 0 });
		pointY.set(-a / 2, { duration: 0 });
	};

	const canvasHeight = 500;

	const a = 300;
	$: b = a / ratio;

	$: pointX = tweened(-b / 2);
	$: pointY = tweened(-a / 2);

	const aDuration = 700;
	$: bDuration = (b * aDuration) / a;

	const top = () => {
		pointX.set(b / 2, { duration: bDuration });
		pointY.set(-a / 2, { duration: bDuration }).then(() => {
			kick.play();
			right();
		});
	};
	const right = () => {
		pointX.set(b / 2, { duration: aDuration });
		pointY.set(a / 2, { duration: aDuration }).then(() => {
			snare.play();
			bottom();
		});
	};
	const bottom = () => {
		pointX.set(-b / 2, { duration: bDuration });
		pointY.set(a / 2, { duration: bDuration }).then(() => {
			kick.play();
			left();
		});
	};
	const left = () => {
		pointX.set(-b / 2, { duration: aDuration });
		pointY.set(-a / 2, { duration: aDuration }).then(() => {
			snare.play();
			top();
		});
	};
</script>

<svg height={canvasHeight}>
	<g transform={`translate(550, ${canvasHeight / 2})`}>
		<rect width={b} height={a} />
		<circle r={10} cx={$pointX} cy={$pointY} />
	</g>
</svg>
<button on:click={top}>go</button>
<button on:click={stop}>stop</button>

<style>
	svg {
		width: 100%;
	}
	rect {
		fill: none;
		stroke-width: 3px;
		stroke: cornflowerblue;
		transform-box: fill-box;
		transform: translate(-50%, -50%);
	}
	circle {
		fill: red;
	}
</style>
