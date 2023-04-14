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

	const { getT, getInstrumentToggles } = getContext("song");
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
	class:played={$t >= note - buffer}
	transition:fade
	style:height={`${height}px`}
	style:width={`${width}px`}
	style:left={`${x}px`}
	style:--color={color}
/>

<style>
	div {
		background: var(--color);
		opacity: 80%;
		position: absolute;
		transition: all 100ms;
	}
	.played {
		animation: 350ms ease-in-out grow;
	}

	@keyframes grow {
		0% {
			transform: scale(1);
			background: var(--color);
			z-index: 1000;
		}
		50% {
			transform: scale(1.1);
			background: var(--color);
			z-index: 1000;
		}
		100% {
			transform: scale(1);
			background: white;
			z-index: 1000;
		}
	}
</style>
