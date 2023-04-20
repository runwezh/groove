<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";

	export let note;
	export let cx;
	export let cy;
	export let playing;

	const { getT } = getContext("song");
	const t = getT();

	const hihat = new Howl({
		src: ["assets/sound/hihat.mp3"]
	});

	const buffer = 0.05;
	$: hit = $t >= note && $t < note + buffer;
	$: if (hit && hihat.state() === "loaded") hihat.play();
</script>

<circle {cx} {cy} r={10} style:transform="translate(50%, 50%)" class:playing />

<style>
	circle {
		transform-origin: center;
		transition: fill 100ms;
	}
	.playing {
		fill: gold;
	}
</style>
