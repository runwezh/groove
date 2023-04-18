<script>
	import Note from "$components/Grid.Note.svelte";
	import { getContext } from "svelte";
	import { range } from "d3";
	import quantize from "$utils/quantize.js";

	export let data;
	export let id;
	export let height;

	const {
		beatsPerMeasure,
		getCurrentMeasure,
		getXScale,
		getInstrumentToggles,
		isPlayable
	} = getContext("song");
	const xScale = getXScale();
	const currentMeasure = getCurrentMeasure();
	const instrumentToggles = getInstrumentToggles();

	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};

	$: quantizedNotes = isPlayable
		? range(0, beatsPerMeasure)
		: quantize(data).filter((d) => d < beatsPerMeasure);
</script>

<div
	class="instrument"
	style:height={`${height}px`}
	class:muted={$instrumentToggles[id] === "off"}
	on:click={() => toggleSound(id)}
	on:keydown={() => toggleSound(id)}
>
	<div class="expected-notes">
		{#each quantizedNotes as note, i}
			{@const x = $xScale(note)}
			{@const next =
				i + 1 < quantizedNotes.length
					? quantizedNotes[i + 1]
					: $xScale.domain()[1]}
			{@const width = $xScale(next) - x}
			<div
				class="expected-note"
				style:height={`${height}px`}
				style:width={`${width}px`}
				style:left={`${x}px`}
			>
				{#if isPlayable}
					<div class="ghost" />
				{/if}
			</div>
		{/each}
	</div>

	<div class="notes">
		{#each data as note, i}
			{@const measure = Math.floor(note / beatsPerMeasure)}
			{@const visible = measure === $currentMeasure}
			{@const x = $xScale(note % beatsPerMeasure)}
			{@const next =
				i + 1 < data.length &&
				data[i + 1] % beatsPerMeasure > note % beatsPerMeasure
					? data[i + 1] % beatsPerMeasure
					: $xScale.domain()[1]}
			{@const width = isPlayable ? 8 : $xScale(next) - x}
			<Note
				{note}
				instrumentId={id}
				{height}
				{width}
				{x}
				color={isPlayable ? "#f4c05c" : i % 2 === 0 ? "#f4c05c" : "#fbe6be"}
				{visible}
			/>
		{/each}
	</div>
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		position: relative;
	}
	.instrument:hover {
		cursor: pointer;
	}
	.notes,
	.expected-notes {
		height: 100%;
	}
	.muted {
		background: var(--color-gray-300);
		opacity: 0.5;
	}
	.expected-note {
		position: absolute;
		background: none;
		border-top: 3px solid var(--color-gray-500);
		border-bottom: 3px solid var(--color-gray-500);
		border-left: 3px solid var(--color-gray-500);
	}
	.expected-note:last-of-type {
		border-right: 3px solid var(--color-gray-500);
	}
	.ghost {
		position: absolute;
		background: var(--color-gray-100);
		width: 8px;
		height: 100%;
		left: 0;
	}
</style>
