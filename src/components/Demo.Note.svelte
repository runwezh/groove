<script>
	import { getContext } from "svelte";

	export let noteData;
	export let instrumentId;
	export let x;
	export let color;
	export let shape;
	export let height;

	const {
		getCurrentBeat,
		getIsPlaying,
		getHighlightedNotes,
		getInstrumentToggles
	} = getContext("song");
	const beat = getCurrentBeat();
	const isPlaying = getIsPlaying();
	const highlightedNotes = getHighlightedNotes();
	const instrumentToggles = getInstrumentToggles();

	$: played =
		$beat >= noteData - 0.05 &&
		$isPlaying &&
		$instrumentToggles[instrumentId] === "on";
	$: highlighted = $highlightedNotes[instrumentId]?.includes(noteData);
</script>

<div
	class:played
	class:highlighted
	style:left={`${x}px`}
	style:--color={color}
	style:height={`${height}px`}
	style:width={`${height}px`}
/>

<style>
	div {
		border-radius: 10px;
		background: var(--color);
		position: absolute;
		transform: translate(-50%, -50%);
		transition: width 800ms, all 300ms;
	}
	.played {
		animation: 300ms ease-in-out grow;
	}
	.highlighted {
		border: 2px solid white;
		transform: translate(-50%, -50%) scale(1.5);
	}

	@keyframes grow {
		0% {
			transform: translate(-50%, -50%) scale(1);
			z-index: 1000;
			opacity: 1;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.2);
			z-index: 1000;
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			z-index: 1000;
			opacity: 1;
		}
	}
</style>
