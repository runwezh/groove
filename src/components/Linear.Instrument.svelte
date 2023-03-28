<script>
	import Note from "$components/Linear.Note.svelte";
	import { getContext } from "svelte";

	export let data;
	export let id;
	export let height;

	const { getXScale, getInstrumentToggles } = getContext("song");
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();

	const noteWidth = 10;

	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};
</script>

<div
	class="instrument"
	style:height={`${height}px`}
	class:muted={$instrumentToggles[id] === "off"}
	on:click={() => toggleSound(id)}
	on:keydown={() => toggleSound(id)}
>
	<div class="notes">
		{#each data as note, i (`${id}-${i}`)}
			{@const x = xScale(note)}
			<Note {note} instrumentId={id} {height} width={noteWidth} {x} />
		{/each}
	</div>
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		background: var(--color-gray-100);
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
