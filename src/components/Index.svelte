<script>
	import { onDestroy, onMount } from "svelte";
	import { Howl, Howler } from "howler";
	import { tweened } from "svelte/motion";
	import { scaleLinear } from "d3";

	const canvasSize = 500;
	const r = 100;

	const kick = new Howl({
		src: ["assets/sound/kick.mp3"]
	});
	const snare = new Howl({
		src: ["assets/sound/snare.mp3"]
	});

	const thetas = tweened([0, Math.PI / 2, Math.PI, (3 / 2) * Math.PI], {
		duration: 5000
	});
	$: dots = $thetas.map((theta) => ({
		x: Math.cos(theta) * r,
		y: Math.sin(theta) * r
	}));
	$: if (dots.some((dot) => dot.y >= r - 0.05 && dot.y <= r + 0.05)) {
		snare.play();
	}

	const turn = () => {
		const fullTurns = 1;
		$thetas = $thetas.map((theta) => theta + Math.PI * 2 * fullTurns);
	};
</script>

<button on:click={turn}>turn</button>

<svg height={canvasSize} width={canvasSize}>
	<g class="egg">
		<circle {r} fill="none" stroke-width={3} stroke={"black"} />

		{#each dots as { x, y }, i}
			<circle class="dot" class:first={i === 0} cx={x} cy={y} r={8} />
		{/each}
	</g>
	<line
		x1={0}
		x2={canvasSize}
		y1={canvasSize / 2 + r}
		y2={canvasSize / 2 + r}
		stroke="black"
	/>
</svg>

<style>
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(90deg);
		}
		50% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.egg {
		transform-origin: center;
		transform: translate(50%, 50%);
		/* animation: spin var(--duration) linear infinite; */
	}
	.dot {
		fill: darkgrey;
	}
	.dot.first {
		fill: coral;
	}
</style>
