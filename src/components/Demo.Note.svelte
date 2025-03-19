<script lang="ts">
	import { getContext } from "svelte";
	import inView from '$actions/inView';

	export let noteData;
	export let instrumentId;
	export let x;
	export let played = false;
	export let highlighted = false;
	export let text = '';

	const { getCurrentBeat, getIsPlaying, getHighlightedNotes, getSeek } =
		getContext("song");
	const beat = getCurrentBeat();
	const isPlaying = getIsPlaying();
	const highlightedNotes = getHighlightedNotes();
	const seek = getSeek();

	const height = 20;

	$: played =
		noteData === 0
			? ($beat < 2) & $isPlaying
			: $beat >= noteData - 0.05 && $isPlaying;
	$: highlighted = $highlightedNotes[instrumentId]?.includes(noteData);

	let inview = false;
	let el: HTMLElement;

	const handleInView = (event: CustomEvent) => {
		inview = event.detail.inView;
	};
</script>

<div
	class:played
	class:highlighted
	class:inview
	class={instrumentId}
	style:top={"50%"}
	style:left={`${x}px`}
	style:height={`${height}px`}
	style:width={`${height}px`}
	bind:this={el}
	use:inView
	on:inview={handleInView}
>
	<p class="text-gray-700 text-lg">{text}</p>
</div>

<style>
	div {
		border-radius: 10px;
		position: absolute;
		transform: translate(-50%, -50%);
		transition: width calc(var(--1s) * 0.8), all calc(var(--1s) * 0.3);
		background: var(--accent-light);
		opacity: 0.5;
	}
	.played {
		animation: calc(var(--1s) * 0.3) ease-in-out grow;
		opacity: 1;
	}
	.highlighted {
		background: var(--accent);
	}
	.inview {
		opacity: 0.8;
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
