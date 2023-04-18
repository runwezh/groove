<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";

	export let instrumentId;
	export let width;
	export let height;
	export let x;
	export let color;
	export let withSound;
	export let visible;
	export let i;

	const {
		beatsPerMeasure,
		getCurrentBeat,
		getCurrentMeasure,
		getInstrumentToggles,
		getIsPlaying,
		isPlayable,
		getData
	} = getContext("song");
	const beat = getCurrentBeat();
	const measure = getCurrentMeasure();
	const instrumentToggles = getInstrumentToggles();
	const data = getData();
	const isPlaying = getIsPlaying();

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

	// $: playing = $beat !== 0 && $beat >= note && $beat < note + buffer;
	// $: if (withSound && playing && isOn) playNote();
	// $: isOn = $instrumentToggles[instrumentId] === "on";

	$: whosPlaying = isPlayable
		? []
		: $data[instrumentId].map((d, i) => {
				const distances = $data[instrumentId].map((n) => {
					const normalizedBeat = $beat + $measure * beatsPerMeasure;
					return Math.abs(n - normalizedBeat);
				});
				const minDistance = Math.min(...distances);
				const minIndex = distances.indexOf(minDistance);
				return minIndex === i;
		  });

	const playNote = () => {
		if (sounds[instrumentId].state() === "loaded") sounds[instrumentId].play();
	};
</script>

<div
	class:playable={isPlayable}
	class:playing={whosPlaying[i] && $isPlaying && $beat > 0}
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
		transition: width 800ms, left 300ms;
	}
	.visible {
		opacity: 0.6;
	}
	.playable.visible {
		opacity: 1;
	}
	.playing {
		background: var(--color-gray-600);
		animation: 350ms ease-in-out grow;
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
