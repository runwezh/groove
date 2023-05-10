<script>
	import Note from "$components/Demo.Note.svelte";
	import { getContext, onMount } from "svelte";
	import { range } from "d3";
	import _ from "lodash";

	export let i;
	export let id;
	export let data;
	export let action;

	const {
		songId,
		getAllParts,
		beatsPerMeasure,
		getXScale,
		getInstrumentToggles,
		getInstrumentStyles,
		getHighlightedNotes,
		getWidth,
		getXOffset,
		getCurrentActionIndex,
		style
	} = getContext("song");
	const allParts = getAllParts();
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();
	const instrumentStyles = getInstrumentStyles();
	const highlightedNotes = getHighlightedNotes();
	const width = getWidth();
	const xOffset = getXOffset();
	const currentActionIndex = getCurrentActionIndex();

	let notesContainer;
	let actionOn = false;
	let originalData = data;
	let originalStyle = $instrumentStyles[id];

	const noteHeight = 20;
	const formatLabel = (str) => _.upperFirst(str === "hihat" ? "hi-hat" : str);

	const mute = (id) => {
		if (style !== "real") {
			$instrumentToggles[id] = $instrumentToggles[id] === "off" ? "on" : "off";
		}
	};
	const doAction = (e) => {
		if (actionOn) {
			$instrumentStyles[id] = originalStyle;
			$highlightedNotes[id] = [];
		} else {
			$instrumentStyles[id] = action.style;
			const newNotes = $allParts.find(
				(d) => d.instrument === id && d.style === action.style
			).data;
			if (songId !== "straight") {
				$highlightedNotes[id] = newNotes.filter(
					(d) => !originalData.includes(d)
				);
			}
		}

		// button pulsing
		if (e.target.classList.contains("pulse")) {
			e.target.classList.remove("pulse");
			const actionButtons = document.querySelectorAll(
				`#${songId} button.action-btn`
			);
			const currentIndex = Array.from(actionButtons).indexOf(e.target);
			const nextAction = actionButtons[currentIndex + 1];
			if (nextAction) {
				nextAction.classList.add("visible", "pulse");
			}
			$currentActionIndex += 1;
		}
		actionOn = !actionOn;
	};

	$: buttonText =
		action && actionOn
			? `${songId === "straight" ? "" : "un-"}${action.description}`
			: action && !actionOn
			? `${action.description}`
			: "";

	onMount(() => {
		$xOffset = notesContainer.offsetLeft;
	});
</script>

<div class="instrument">
	<div class="label">{formatLabel(id)}</div>

	<div
		class="notes"
		style:height={`${noteHeight}px`}
		bind:clientWidth={$width}
		bind:this={notesContainer}
		class:muted={$instrumentToggles[id] === "off"}
		class:clickable={style !== "real"}
		on:click={() => mute(id)}
		on:keydown={() => mute(id)}
	>
		{#each data as note}
			{@const x = $xScale(note % beatsPerMeasure)}
			<Note noteData={note} instrumentId={id} {x} height={noteHeight} />
		{/each}

		{#each range(0, beatsPerMeasure, 0.5) as dot}
			{@const left = $xScale(dot)}
			<div class="dot" style:left={`${left}px`} />
		{/each}
	</div>

	{#if action}
		<button
			class="action-btn"
			on:click={doAction}
			disabled={songId === "straight" && actionOn}>{buttonText}</button
		>
	{/if}
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		margin: 1em 0;
		height: 50px;
	}
	.clickable:hover {
		cursor: pointer;
	}
	.muted {
		opacity: 0.5;
	}
	.notes {
		position: relative;
		width: 70%;
		margin-left: 3em;
	}
	.label {
		min-width: 10%;
	}
	.action-btn {
		font-family: var(--mono);
		font-size: var(--14px);
		visibility: hidden;
		width: 15%;
		margin-left: 5%;
		max-height: 100%;
		flex-shrink: 0;
	}
	:global(.action-btn.visible) {
		visibility: visible;
	}
</style>
