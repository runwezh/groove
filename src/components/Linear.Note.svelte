<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { fade } from "svelte/transition";

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
	$: playing = $t >= note && $t < note + buffer;
	$: isOn = $instrumentToggles[instrumentId] === "on";
	// $: if (playing && isOn) playNote();

	const playNote = () => {
		if (sounds[instrumentId].state() === "loaded") sounds[instrumentId].play();
	};
</script>

<rect
	class:playing={playing && isOn}
	class:off-grid={offGrid}
	transition:fade
	{x}
	{height}
	{width}
/>

<style>
	rect {
		fill: var(--color-gray-400);
		opacity: 0.4;
		transition: all 100ms;
	}
	.playing {
		fill: red;
		opacity: 1;
	}
	.off-grid {
		/* fill: cornflowerblue; */
	}
</style>
