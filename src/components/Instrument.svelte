<script>
	import Note from "$components/Note.svelte";

	export let id;
	export let i;
	export let data;
	export let xScale;
	export let yScale;
	export let angleScale;
	export let type;
	export let t;
	export let isOn = true;

	const colors = {
		hihat: "lightblue",
		kick: "darkblue",
		snare: "cornflowerblue"
	};
</script>

{#if type === "linear"}
	<g {id} transform={`translate(0, ${yScale(i)})`}>
		{#each data as note, noteNum}
			<Note
				{note}
				color={colors[id]}
				{id}
				{xScale}
				{type}
				i={noteNum}
				{t}
				{isOn}
			/>
		{/each}
	</g>
{:else if type === "circular"}
	{#each data as note, noteNum}
		<Note
			{note}
			color={colors[id]}
			{id}
			{angleScale}
			{type}
			innerRadius={150 + i * 22}
			i={noteNum}
			{t}
			{isOn}
		/>
	{/each}
{/if}
