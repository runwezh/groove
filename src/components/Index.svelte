<script>
	import Linear from "$components/Linear.svelte";
	import Range from "$components/helpers/Range.svelte";
	import Circular from "$components/Circular.svelte";
	import { range } from "d3";
	import Toggle from "$components/helpers/Toggle.svelte";

	let value = 0;
	let options = [
		"straight",
		"septuplet swing",
		"quintuplet swing",
		"triplet swing"
	];
	let showPercentage = false;
	let showDivisions = false;

	const swing = (ratio) => {
		// could have parameter "beats" if we want more
		return [0, ratio];
	};
	const straight = {
		hihat: swing(0.5)
	};
	const triplet = {
		hihat: swing(2 / 3)
	};
	const quintuplet = {
		hihat: swing(3 / 5)
	};
	const septuplet = {
		hihat: swing(4 / 7)
	};
	const fallInLove = {
		hihat: [1 / 7, 4 / 7, 8 / 7, 11 / 7, 15 / 7, 18 / 7, 22 / 7, 25 / 7],
		snare: [1, 3],
		kick: [0, 2]
	};
	const data = [straight, septuplet, quintuplet, triplet];
	const parts = [2, 7, 5, 3];
</script>

<Circular
	data={data[value]}
	beats={1}
	parts={parts[value]}
	{showPercentage}
	{showDivisions}
/>

<h2>{options[value]}</h2>
<div style="width: 50%">
	<Range
		min={0}
		max={options.length - 1}
		step={1}
		showTicks={true}
		ticks={[50, 57, 60, 66]}
		bind:value
	/>
</div>

{#if value === 0}
	<p>
		This rhythm is completely <strong>straight</strong>. Each beat is equally
		spaced apart.
	</p>
{:else}
	<p>
		This rhythm is <strong>swung</strong>. Swing means that there's a long-short
		pattern, so the first note takes up more space than the second.
	</p>
{/if}
<p>
	In this case, the first beat takes up <strong
		>{(data[value].hihat[1] * 100).toFixed(1)}%</strong
	> of the beat.
</p>
<Toggle label="Show percentage" style="inner" bind:value={showPercentage} />

{#if value !== 0}
	<p>
		It's called a <strong>{options[value]} swing</strong> because the beat is
		divided into {parts[value]} parts. Since we're dividing the beat into an odd
		number of parts, it will be uneven and have this slightly off-kilter feeling.
	</p>
	<Toggle label="Show divisions" style="inner" bind:value={showDivisions} />
{/if}

<h3 style="margin-top: 4em">
	[WIP] visualizing a song (including other drum parts)
</h3>
<Circular data={fallInLove} beats={4} />
