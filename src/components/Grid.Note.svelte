<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { fade, scale } from "svelte/transition";

	export let note;
	export let instrumentId;
	export let width;
	export let height;
	export let x;
	export let color;
	export let withSound;
	export let visible;

	const { beatsPerMeasure, getT, getInstrumentToggles, isPlayable } =
		getContext("song");
	const t = getT();
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

	$: playing = $t !== 0 && $t >= note && $t < note + buffer;
	$: isOn = $instrumentToggles[instrumentId] === "on";
	$: if (withSound && playing && isOn) playNote();

	const playNote = () => {
		if (sounds[instrumentId].state() === "loaded") sounds[instrumentId].play();
	};
</script>

<div
	class:played={$t >= (note % beatsPerMeasure) - buffer && !isPlayable}
	class:visible
	transition:fade
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

		/* transition: all 100ms; */
	}
	.visible {
		opacity: 1;
	}
	.played {
		/* animation: 350ms ease-in-out grow; */
		outline: 2px solid white;
		background: var(--color-gray-800);
	}

	@keyframes grow {
		0% {
			transform: scale(1);
			z-index: 1000;
		}
		50% {
			transform: scale(1.1);
			z-index: 1000;
		}
		100% {
			transform: scale(1);
			z-index: 1000;
		}
	}
</style>
