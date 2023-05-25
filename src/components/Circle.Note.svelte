<script>
	import { getContext } from "svelte";

	export let note;
	export let cx;
	export let cy;

	const { getCurrentBeat } = getContext("song");
	const beat = getCurrentBeat();

	$: played =
		(note !== 0 && $beat >= note - 0.05) || (note === 0 && $beat * 2 < 1);
</script>

<circle {cx} {cy} r={10} class:played />

<style>
	circle {
		transform-box: fill-box;
		transform-origin: center;
		transition: fill calc(var(--1s) * 0.1);
		fill: var(--accent-light);
	}
	.played {
		animation: calc(var(--1s) * 0.3) ease-in-out grow;
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
