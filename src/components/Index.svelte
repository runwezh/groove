<script>
	import Linear from "$components/Linear.svelte";
	import Range from "$components/helpers/Range.svelte";
	import Circular from "$components/Circular.svelte";
	import { range } from "d3";

	let value = 0;
	let options = ["straight", "septuplet", "quintuplet", "triplet"];

	const swing = (ratio) => {
		return [0, ratio, 1, 1 + ratio, 2, 2 + ratio, 3, 3 + ratio];
	};

	const straight = {
		hihat: swing(0.5),
		snare: [1, 3],
		kick: [0, 2]
	};
	const triplet = {
		hihat: swing(2 / 3),
		snare: [1, 3],
		kick: [0, 2]
	};
	const quintuplet = {
		hihat: swing(3 / 5),
		snare: [1, 3],
		kick: [0, 2]
	};
	const septuplet = {
		hihat: swing(4 / 7),
		snare: [1, 3],
		kick: [0, 2]
	};
	const fallInLove = {
		hihat: [1 / 7, 4 / 7, 8 / 7, 11 / 7, 15 / 7, 18 / 7, 22 / 7, 25 / 7],
		snare: [1, 3],
		kick: [0, 2]
	};
	const data = [straight, septuplet, quintuplet, triplet];
</script>

<Circular data={data[value]} />

<h2>{options[value]}</h2>
<div style="width: 50%">
	<Range
		min={0}
		max={options.length - 1}
		step={1}
		showTicks={true}
		bind:value
	/>
</div>

<!-- <Linear data={straight} /> -->
<!-- <Linear data={fallInLove} /> -->
