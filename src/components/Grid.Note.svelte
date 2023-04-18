<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";

	export let note;
	export let instrumentId;
	export let width;
	export let height;
	export let x;
	export let color;
	export let withSound;
	export let visible;

	const { beatsPerMeasure, getCurrentBeat, getInstrumentToggles, isPlayable } =
		getContext("song");
	const beat = getCurrentBeat();
	const instrumentToggles = getInstrumentToggles();

	const buffer = 0.05;

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

	$: playing = $beat !== 0 && $beat >= note && $beat < note + buffer;
	$: isOn = $instrumentToggles[instrumentId] === "on";
	$: if (withSound && playing && isOn) playNote();

	const playNote = () => {
		if (sounds[instrumentId].state() === "loaded") sounds[instrumentId].play();
	};
</script>

<div
	class:played={$beat >= (note % beatsPerMeasure) - buffer && !isPlayable}
	class:playable={isPlayable}
	class:visible
	style:height={`${height}px`}
	style:width={`${width}px`}
	style:left={`${x}px`}
	style:--color={color}
/>

<style>
	div {
		background: var(--color);
		position: absolute;
		opacity: 0;
		transition: left 100ms;
	}
	.visible {
		opacity: 0.6;
	}
	.playable.visible {
		opacity: 1;
	}
	.played.visible {
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
