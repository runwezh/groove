<script>
	import Grid from "$components/Grid.svelte";
	import { range } from "d3";

	let isPlaying = false;
	let hits = [];
	let numHits = 0;

	const onKeyDown = (e) => {
		if (isPlaying && e.keyCode === 32) {
			numHits += 1;
			hits = range(numHits);
		}
	};

	// i need to know: current seek, time -> beat, beat -> x value

	// 1. make Play a child of Grid
	// 2. have Grid fire an event when the space bar is pressed (if it's playable)
	// 3. more binds

	$: console.log({ hits });
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<Grid
	id="intro_beat"
	beatsPerRotation={16}
	dataOverride={{ hihat: hits }}
	bind:isPlaying
/>
