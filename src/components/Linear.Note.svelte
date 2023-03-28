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
	class:playing
	class:played={$t > note + buffer}
	class:off-grid={offGrid}
	transition:fade
	style:height={`${height}px`}
	style:width={`${width}px`}
	style:left={`${x}px`}
/>

<style>
	div {
		background: var(--color-gray-600);
		position: absolute;
		opacity: 0.4;
		transition: all 100ms;
	}
	.playing {
		background: gold;
		/* background: #5bffe2; */
		opacity: 1;
		transform: scale(1.5);
	}
	.played {
		background: gold;
	}
	.off-grid {
		/* fill: cornflowerblue; */
	}
</style>
