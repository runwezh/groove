<script>
	import Note from "$components/Note.svelte";

	export let id;
	export let i;
	export let data;
	export let xScale;
	export let yScale;
	export let rScale;
	export let type;

	const colors = { hihat: "red", kick: "black", snare: "purple" };
</script>

{#if type === "linear"}
	<g {id} transform={`translate(0, ${yScale(i)})`}>
		{#each data as note}
			<Note {note} color={colors[id]} {id} {xScale} {type} />
		{/each}
	</g>
{:else if type === "circular"}
	{#each data as note, noteNum}
		<Note
			{note}
			color={colors[id]}
			{id}
			{rScale}
			{type}
			innerRadius={150 + i * 20}
			i={noteNum}
		/>
	{/each}
{/if}
