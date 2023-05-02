<script>
	import Note from "$components/Song.Note.svelte";
	import { getContext, onMount, tick } from "svelte";
	import { range } from "d3";

	export let id;
	export let instrumentData;
	export let action;

	const {
		getData,
		beatsPerMeasure,
		getXScale,
		getInstrumentToggles,
		getHighlightedNotes,
		getWidth,
		getHeight,
		getXOffset,
		gridlines
	} = getContext("song");
	const data = getData();
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();
	const highlightedNotes = getHighlightedNotes();
	const width = getWidth();
	const height = getHeight();
	const xOffset = getXOffset();

	const noteHeight = 20;
	const colors = {
		kick: "#f94144",
		snare: "#f3722c",
		hihat: "#f9c74f",
		bass: "#90be6d"
	};
	const shapes = {
		kick: "circle",
		snare: "square",
		hihat: "triangle",
		bass: "circle"
	};
	const toggleSound = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "on" ? "off" : "on";
	};
	const doAction = async () => {
		if (actionOn) {
			$data[id] = originalData;
			$highlightedNotes[id] = [];
		} else {
			$data[id] = action.update;
			$highlightedNotes[id] = action.update.filter(
				(d) => !originalData.includes(d)
			);
		}
		actionOn = !actionOn;
	};
	$: buttonText =
		action && actionOn
			? `un-${action.description}`
			: action && !actionOn
			? `${action.description}`
			: "";

	let notesContainer;
	let actionOn = false;
	let originalData = instrumentData;

	onMount(() => {
		$xOffset = notesContainer.offsetLeft;
	});
</script>

<div class="instrument">
	<div class="label">{id}</div>

	<div
		class="notes"
		style:height={`${noteHeight}px`}
		bind:clientWidth={$width}
		bind:this={notesContainer}
		class:muted={$instrumentToggles[id] === "off"}
		on:click={() => toggleSound(id)}
		on:keydown={() => toggleSound(id)}
	>
		{#if gridlines && id === "bass"}
			<div class="grid">
				{#each range(0, beatsPerMeasure) as bar}
					{@const thick = bar % 1 === 0}
					{@const left = $xScale(bar)}
					<div
						class="line"
						class:thick
						style:left={`${left}px`}
						style:height={`${$height}px`}
					/>
				{/each}
			</div>
		{/if}

		{#each instrumentData as note}
			{@const x = $xScale(note % beatsPerMeasure)}
			{@const color = colors[id]}
			{@const shape = shapes[id]}
			<Note
				noteData={note}
				instrumentId={id}
				{x}
				{color}
				{shape}
				height={noteHeight}
			/>
		{/each}

		{#each range(0, beatsPerMeasure, 0.5) as dot}
			{@const left = $xScale(dot)}
			<div class="dot" style:left={`${left}px`} />
		{/each}
	</div>

	<div class="action">
		<button class:visible={action} on:click={doAction}>{buttonText}</button>
	</div>
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		margin: 1em 0;
	}
	.instrument:hover {
		cursor: pointer;
	}
	.muted {
		opacity: 0.5;
	}
	.notes {
		position: relative;
		width: 100%;
		margin: 0 1em 0 3em;
	}
	.label {
		width: 4em;
	}
	.dot {
		background: var(--color-gray-200);
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 2.5px;
		transform: translate(-50%, -50%);
		z-index: -1;
	}
	.grid {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		transform: translate(0, -100%);
	}
	.grid .line {
		background: var(--color-gray-200);
		width: 1px;
		position: absolute;
		z-index: -1;
	}
	.action {
		font-family: var(--mono);
		font-size: var(--14px);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.action button {
		visibility: hidden;
		width: 8em;
	}
	.action button.visible {
		visibility: visible;
	}
</style>
