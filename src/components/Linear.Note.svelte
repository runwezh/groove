<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { fade, scale } from "svelte/transition";

	export let note;
	export let instrumentId;
	export let width;
	export let height;
	export let x;

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

	$: offGrid = note % 0.0625 !== 0; // 16th note
	$: playing = $t !== 0 && $t >= note && $t < note + buffer;
	$: isOn = $instrumentToggles[instrumentId] === "on";
	// $: if (playing && isOn) playNote();

	const playNote = () => {
		if (sounds[instrumentId].state() === "loaded") sounds[instrumentId].play();
	};
</script>

<div
	class:played={$t >= note - buffer}
	class:off-grid={offGrid}
	transition:fade
	style:height={`${height}px`}
	style:width={`${width}px`}
	style:left={`${x}px`}
/>

<style>
	div {
		background: var(--color-gray-300);
		position: absolute;
		transition: all 100ms;
	}
	.playing {
		opacity: 1;
	}
	.played {
		background: var(--color-gray-600);
		animation: 500ms ease-in-out grow;
	}
	.off-grid {
		/* fill: cornflowerblue; */
	}

	@keyframes grow {
		0% {
			transform: scale(1);
			background: gold;
		}
		50% {
			transform: scale(1.2);
			background: gold;
		}
		100% {
			transform: scale(1);
			background: var(--color-gray-600);
		}
	}
</style>
