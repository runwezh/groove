<script>
	import Note from "$components/Grid.Note.svelte";
	import { getContext } from "svelte";
	import { range } from "d3";

	export let data;
	export let id;
	export let height;

	const {
		beatsPerMeasure,
		getCurrentMeasure,
		getXScale,
		getInstrumentToggles,
		getGridToggles,
		isPlayable
	} = getContext("song");
	const xScale = getXScale();
	const currentMeasure = getCurrentMeasure();
	const instrumentToggles = getInstrumentToggles();
	const gridToggles = getGridToggles();

	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};

	const determineQuantizeValue = (beats) => {
		const beatValues = [0.0625, 0.125, 0.25, 0.5, 1]; // possible beat values in quarter notes
		const secondValue = beats[1];

		if (!secondValue) return 1;

		const distances = beatValues.map((value) => Math.abs(value - secondValue));
		return beatValues[distances.indexOf(Math.min(...distances))];
	};

	const quantize = (beats, quantizeValue) => {
		return beats.map(
			(beat) => Math.round(beat / quantizeValue) * quantizeValue
		);
	};

	$: quantizedNotes = isPlayable
		? range(0, 4)
		: quantize(data, determineQuantizeValue(data)).filter(
				(d) => d < beatsPerMeasure
		  );
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
			/>
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
			{@const width = isPlayable ? 5 : $xScale(next) - x}
			<Note
				{note}
				instrumentId={id}
				{height}
				{width}
				{x}
				color={i % 2 === 0 ? "#f4c05c" : "#fbe6be"}
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
		z-index: 1000;
	}
	.expected-note:last-of-type {
		border-right: 3px solid var(--color-gray-500);
	}
</style>
