<script>
	import { Howl } from "howler";
	import { tweened } from "svelte/motion";
	import { getContext } from "svelte";

	export let color;
	export let note;
	export let id;
	export let innerRadius;

	const { getAngleScale, getT, getInstrumentToggles } = getContext("song");
	const angleScale = getAngleScale();
	const t = getT();
	const instrumentToggles = getInstrumentToggles();

	const defaultDuration = 0.05;
	const defaultR = 10;
	const playingR = 20;

	$: playing = $t >= note && $t < note + defaultDuration;
	$: isOn = instrumentToggles[id] === "on";
	$: if (playing && isOn) playNote();

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
	const x = (theta) => innerRadius * Math.cos(theta);
	const y = (theta) => innerRadius * Math.sin(theta);
	const r = tweened(defaultR);

	const playNote = () => {
		if (sounds[id].state() === "loaded") sounds[id].play();

		if (id !== "hihat") {
			r.set(defaultR, { duration: 0 });
			r.set(playingR, { duration: 250 }).then(() =>
				r.set(defaultR, { duration: 250 })
			);
		}
	};
</script>

<circle
	fill={color}
	r={$r}
	cx={x(angleScale(note))}
	cy={y(angleScale(note))}
	class:muted={!isOn}
/>

<style>
	circle {
		transform: translate(50%, 50%);
	}
	.muted {
		opacity: 0.5;
	}
</style>
