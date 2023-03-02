<script>
	import SwingPercentage from "$components/SwingPercentage.svelte";
	import Circular from "$components/Circular.svelte";
	import Linear from "$components/Linear.svelte";
	import { range } from "d3";

	const fallInLove = {
		//hihat: [1 / 7, 4 / 7, 8 / 7, 11 / 7, 15 / 7, 18 / 7, 22 / 7, 25 / 7],
		hihat: range(0, 4, 0.5),
		snare: [1, 3],
		kick: [0, 2]
	};
</script>

<SwingPercentage />

<h3 style="margin-top: 2em">[WIP] visualizing a song</h3>
<Circular data={fallInLove} beatsPerRotation={4} division={7} bpm={100} />
<!-- <Linear data={fallInLove} beatsPerRotation={4} division={7} bpm={100} /> -->
