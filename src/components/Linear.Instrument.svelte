<script>
	import Note from "$components/Linear.Note.svelte";
	import Grid from "$components/Linear.Grid.svelte";
	import { getContext } from "svelte";

	export let data;
	export let id;
	export let height;

	const { getXScale, getInstrumentToggles, getGridToggles } =
		getContext("song");
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();
	const gridToggles = getGridToggles();

	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};

	const colors = {
		snare: "#96c8d7",
		hihat: "gold",
		kick: "#550e5c"
	};
</script>

<div
	class="instrument"
	style:height={`${height}px`}
	class:muted={$instrumentToggles[id] === "off"}
	on:click={() => toggleSound(id)}
	on:keydown={() => toggleSound(id)}
>
	{#if $gridToggles[id] === "on"}
		<Grid />
	{/if}

	<div class="notes">
		{#each data as note, i (`${id}-${i}`)}
			{@const x = $xScale(note)}
			{@const next = i + 1 < data.length ? data[i + 1] : $xScale.domain()[1]}
			{@const width = $xScale(next) - x}
			<Note {note} instrumentId={id} {height} {width} {x} color={colors[id]} />
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
	.notes {
		height: 100%;
	}
	.muted {
		background: var(--color-gray-300);
		opacity: 0.5;
	}
</style>
