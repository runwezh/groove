<script>
	import { Howl } from "howler";
	import { tweened } from "svelte/motion";

	export let color;
	export let note;
	export let id;
	export let xScale;
	export let angleScale;
	export let type;
	export let innerRadius;
	export let i;
	export let t;
	export let isOn;

	const defaultDuration = 0.05;
	const defaultHeight = 20;
	const defaultR = 10;
	const playingR = 20;

	$: playing = t >= note && t < note + defaultDuration;
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

{#if type === "linear"}
	<rect
		x={xScale(note)}
		width={xScale(defaultDuration)}
		height={defaultHeight}
		fill={color}
		class:playing
	/>
{:else if type === "circular"}
	<circle
		fill={color}
		r={$r}
		cx={x(angleScale(note))}
		cy={y(angleScale(note))}
		class:muted={!isOn}
	/>
{/if}

<style>
	circle {
		transform: translate(50%, 50%);
	}
	.muted {
		opacity: 0.5;
	}
</style>
