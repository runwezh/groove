<script>
	import { t } from "$stores/misc.js";
	import { Howl, Howler } from "howler";
	import { arc } from "d3";

	export let color;
	export let note;
	export let id;
	export let xScale;
	export let rScale;
	export let type;
	export let innerRadius;

	const defaultDuration = 0.1;
	const defaultHeight = 20;

	$: playing = $t >= note && $t < note + defaultDuration;

	$: if (playing) sound();

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

	let noteArc = arc()
		.innerRadius(innerRadius)
		.outerRadius(innerRadius + 15)
		.startAngle(rScale(note))
		.endAngle(rScale(note + defaultDuration));

	const sound = () => {
		sounds[id].play();
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
	<path
		d={noteArc()}
		fill={color}
		class:playing
		style:transform={"translate(50%, 50%)"}
	/>
{/if}

<style>
	rect,
	path {
		opacity: 0.3;
	}
	.playing {
		opacity: 1;
	}
</style>
