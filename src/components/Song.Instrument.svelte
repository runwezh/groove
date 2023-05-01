<script>
	import Note from "$components/Song.Note.svelte";
	import { getContext } from "svelte";
	import { range } from "d3";
	import quantize from "$utils/quantize.js";

	export let data;
	export let id;
	export let shape = "circle";

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

	const noteHeight = 20;
	const colors = { kick: "#f94144", snare: "#f3722c", hihat: "#f9c74f" };
	const shapes = { kick: "circle", snare: "square", hihat: "triangle" };
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
	<div class="notes" style:height={`${noteHeight}px`}>
		{#each data as note, i}
			{@const x = $xScale(note % beatsPerMeasure)}
			{@const color = colors[id]}
			{@const shape = shapes[id]}
			<Note
				instrumentId={id}
				noteData={note}
				{x}
				{color}
				{shape}
				height={noteHeight}
				{i}
			/>
		{/each}

		{#each range(0, beatsPerMeasure, 0.5) as dot}
			{@const left = $xScale(dot)}
			<div class="dot" style:left={`${left}px`} />
		{/each}
	</div>
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		position: relative;
		margin: 1em 0;
	}
	.instrument:hover {
		cursor: pointer;
	}
	.muted {
		background: var(--color-gray-300);
		opacity: 0.5;
	}
	.dot {
		background: var(--color-gray-200);
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 2px;
		transform: translate(-50%, -50%);
	}
</style>
