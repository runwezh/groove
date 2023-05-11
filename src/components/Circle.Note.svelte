<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";

	export let note;
	export let cx;
	export let cy;

	const { getT } = getContext("song");
	const t = getT();

	const hihat = new Howl({
		src: ["assets/sound/hihat.mp3"]
	});

	const buffer = 0.05;
	$: hit = $t >= note && $t < note + buffer;
	$: if (hit && hihat.state() === "loaded") hihat.play();
	$: played = $t >= note - buffer && Math.abs($t - note) < 0.2;
</script>

<circle {cx} {cy} r={10} class:played />

<style>
	circle {
		transform-box: fill-box;
		transform-origin: center;
		transition: fill 100ms;
		fill: var(--accent-light);
	}
	.played {
		animation: 300ms ease-in-out grow;
	}

	@keyframes grow {
		0% {
			transform: scale(1);
			fill: var(--accent-light);
		}
		50% {
			transform: scale(1.2);
			fill: var(--accent);
		}
		100% {
			transform: scale(1);
			fill: var(--accent-light);
		}
	}
</style>
