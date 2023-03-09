<script>
	import Note from "$components/Linear.Note.svelte";
	import { getContext } from "svelte";

	export let data;
	export let id;
	export let height;

	const { getXScale, beatsPerRotation, getInstrumentToggles } =
		getContext("song");
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();

	const noteWidth = 10;
</script>

{#each data as note, i (`${id}-${i}`)}
	{@const x = xScale(note)}
	{@const first = i === 0}
	{@const last = i === data.length - 1}
	{@const barX = first ? noteWidth : xScale(data[i - 1]) + noteWidth}
	{@const barWidth = first ? x : Math.abs(x - barX)}
	{@const muted = $instrumentToggles[id] === "off"}

	<rect class:muted {height} width={barWidth} x={barX} />
	{#if last}
		<rect
			class:muted
			{height}
			width={Math.abs(xScale(beatsPerRotation) - x)}
			{x}
		/>
	{/if}

	<Note {note} instrumentId={id} {height} width={noteWidth} {x} />
{/each}

<style>
	rect {
		fill: lightyellow;
		transition: all 1s;
	}
	.muted {
		fill: var(--color-gray-300);
		opacity: 0.5;
	}
</style>
