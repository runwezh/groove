<script>
	import { getContext } from "svelte";
	import { tweened } from "svelte/motion";
	import { easeCubicOut, easeCubicIn } from "d3-ease";

	export let data;
	export let id;
	export let i;

	const { getT, beatsPerRotation, getCycleDuration } = getContext("song");
	const t = getT();
	const duration = getCycleDuration();
	const r = 40;
	const cy = tweened(500 - r);
	$: msInBeat = duration / beatsPerRotation;
	$: playing = data.some((d) => Math.abs($t, d) < 0.1);

	const start = () => {
		rise(msInBeat);
	};
	const rise = (dur) => {
		cy.set(r, { duration: dur, easing: easeCubicOut }).then(() =>
			fall(msInBeat)
		);
	};
	const fall = (dur) => {
		cy.set(500 - r, { duration: dur, easeCubicIn });
	};
</script>

<circle
	class:playing
	fill="cornflowerblue"
	{r}
	cx={r}
	cy={$cy}
	on:click={start}
/>

<style>
	.playing {
		fill: red;
	}
</style>
