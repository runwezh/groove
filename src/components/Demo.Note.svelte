<script>
	import { getContext } from "svelte";

	export let noteData;
	export let instrumentId;
	export let x;

	const { getCurrentBeat, getIsPlaying, getHighlightedNotes } =
		getContext("song");
	const beat = getCurrentBeat();
	const isPlaying = getIsPlaying();
	const highlightedNotes = getHighlightedNotes();

	const height = 20;

	$: played =
		noteData === 0
			? ($beat < 2) & $isPlaying
			: $beat >= noteData - 0.05 && $isPlaying;
	$: highlighted = $highlightedNotes[instrumentId]?.includes(noteData);
</script>

<div
	class:played
	class:highlighted
	class={instrumentId}
	style:top={"50%"}
	style:left={`${x}px`}
	style:height={`${height}px`}
	style:width={`${height}px`}
/>

<style>
	div {
		border-radius: 10px;
		position: absolute;
		transform: translate(-50%, -50%);
		transition: width calc(var(--1s) * 0.8), all calc(var(--1s) * 0.3);
		background: var(--accent-light);
	}
	.played {
		animation: calc(var(--1s) * 0.3) ease-in-out grow;
	}
	.highlighted {
		background: var(--accent);
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
