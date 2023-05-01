<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";

	export let instrumentId;
	export let noteData;
	export let x;
	export let color;
	export let shape;
	export let height;
	export let i;

	const {
		beatsPerMeasure,
		getCurrentBeat,
		getCurrentMeasure,
		getInstrumentToggles,
		getData
	} = getContext("song");
	const beat = getCurrentBeat();
	const measure = getCurrentMeasure();
	const instrumentToggles = getInstrumentToggles();
	const data = getData();

	$: startingNote = $data[instrumentId][0];
	$: whosPlaying = $data[instrumentId].map((d, i) => {
		const distances = $data[instrumentId].map((n) => {
			const normalizedBeat = $beat + $measure * beatsPerMeasure;
			return Math.abs(n - normalizedBeat);
		});
		const minDistance = Math.min(...distances);
		const minIndex = distances.indexOf(minDistance);
		return minIndex === i;
	});
</script>

<div
	class:playing={whosPlaying[i] && $beat >= noteData && $beat >= startingNote}
	class:played={noteData < $beat + $measure * beatsPerMeasure}
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
		opacity: 0;
		transform: translate(-50%, -50%);
		transition: width 800ms, left 300ms;
	}
	.played {
		opacity: 0.5;
	}
	.playing {
		opacity: 1;
		background: var(--color-gray-600);
		/* animation: 350ms ease-in-out grow; */
	}

	@keyframes grow {
		0% {
			transform: scale(1);
			z-index: 1000;
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			z-index: 1000;
			opacity: 1;
		}
		100% {
			transform: scale(1);
			z-index: 1000;
			opacity: 1;
		}
	}
</style>
