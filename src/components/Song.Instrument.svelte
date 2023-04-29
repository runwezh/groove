<script>
	import Note from "$components/Song.Note.svelte";
	import { getContext } from "svelte";
	import { range } from "d3";
	import quantize from "$utils/quantize.js";

	export let data;
	export let id;
	export let shape = "circle";
	export let color = "orange";

	const {
		songId,
		beatsPerMeasure,
		getCurrentMeasure,
		getXScale,
		getInstrumentToggles,
		isPlayable,
		getIsPlaying
	} = getContext("song");
	const xScale = getXScale();
	const currentMeasure = getCurrentMeasure();
	const instrumentToggles = getInstrumentToggles();
	const isPlaying = getIsPlaying();

	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};

	$: quantizeValue = songId === "dmat" ? 0.25 : 0.5;
	$: quantizedNotes = isPlayable
		? range(0, beatsPerMeasure)
		: quantize(data, quantizeValue).filter((d) => d < beatsPerMeasure);
	$: skinnyNotes = isPlayable || songId === "sincerity";

	$: if ($isPlaying && songId === "sincerity") skinnyNotes = false;
</script>

<div
	class="instrument"
	class:muted={$instrumentToggles[id] === "off"}
	on:click={() => toggleSound(id)}
	on:keydown={() => toggleSound(id)}
>
	<div class="notes">
		{#each data as note, i}
			{@const measure = Math.floor(note / beatsPerMeasure)}
			{@const x = $xScale(note % beatsPerMeasure)}
			{@const next =
				i + 1 < data.length &&
				data[i + 1] % beatsPerMeasure > note % beatsPerMeasure
					? data[i + 1] % beatsPerMeasure
					: $xScale.domain()[1]}
			<Note instrumentId={id} noteData={note} {x} {color} {shape} {i} />
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
	.muted {
		background: var(--color-gray-300);
		opacity: 0.5;
	}
</style>
