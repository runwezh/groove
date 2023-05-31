<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	import Note from "$components/Demo.Note.svelte";
	import { getContext, tick } from "svelte";
	import { range } from "d3";
	import _ from "lodash";
	import viewport from "$stores/viewport.js";
	import mq from "$stores/mq.js";

	export let id;
	export let data;
	export let action;

	const {
		songId,
		getAllParts,
		beatsPerMeasure,
		getXScale,
		getInstrumentStyles,
		getHighlightedNotes,
		getWidth,
		getXOffset,
		getInteractionHeight,
		getCurrentAction,
		getCurrentActionIndex,
		getActions
	} = getContext("song");
	const allParts = getAllParts();
	const xScale = getXScale();
	const instrumentStyles = getInstrumentStyles();
	const highlightedNotes = getHighlightedNotes();
	const width = getWidth();
	const xOffset = getXOffset();
	const currentAction = getCurrentAction();
	const currentActionIndex = getCurrentActionIndex();
	const actions = getActions();

	let actionBtn;
	let notesContainer;
	let actionClickedOnce = false;
	let originalData = data;
	let originalStyle = $instrumentStyles[id];

	const formatLabel = (str) => _.upperFirst(str === "hihat" ? "hi-hat" : str);

	const doAction = () => {
		if (action.on) {
			$instrumentStyles[id] = originalStyle;
			$highlightedNotes[id] = [];
		} else {
			$instrumentStyles[id] = action.style;
			const newNotes = $allParts.find(
				(d) => d.instrument === id && d.style === action.style
			).data;
			if (songId === "straight") $highlightedNotes = {};
			$highlightedNotes[id] = newNotes.filter((d) => !originalData.includes(d));

			if (!actionClickedOnce) {
				const nextAction = $actions[$currentActionIndex + 1];
				if (nextAction) {
					$currentAction = nextAction;
				} else {
					$currentAction = undefined;
				}
				$currentActionIndex += 1;

				actionClickedOnce = true;
			}
		}
		action.on = !action.on;
		$actions = $actions;
	};
	const mobileAction = () => {
		if (actionVisible || (songId === "straight" && current && !action.on)) {
			doAction();
		}
	};

	$: if ($currentActionIndex === 0) {
		actionClickedOnce = false;
	}

	$: mobile = $viewport.width < 600;
	$: current = $currentAction && $currentAction.instrument === id;
	$: if ($width && notesContainer) $xOffset = notesContainer.offsetLeft;
	$: buttonText =
		action && action.on
			? `${songId === "straight" ? "" : "un-"}${action.description}`
			: action && !action.on
			? `${action.description}`
			: "";
	$: mobileButtonText =
		songId === "straight" ? "add" : action && action.on ? "back" : "move";
	$: actionVisible =
		$actions && $currentActionIndex >= $actions.findIndex((d) => d === action);
</script>

<div class="instrument">
	<div class="label">
		{formatLabel(id)}
	</div>

	<div class="notes" bind:this={notesContainer}>
		{#each data as note}
			{@const x = $xScale(note % beatsPerMeasure)}
			<Note noteData={note} instrumentId={id} {x} />
		{/each}

		{#each range(0, beatsPerMeasure, 0.5) as dot}
			{@const left = $xScale(dot)}
			<div class="dot" style:left={`${left}px`} />
		{/each}
	</div>

	{#if action}
		<button
			bind:this={actionBtn}
			class="action-btn"
			class:mobile
			class:pulse={action === $currentAction && !$mq.reducedMotion}
			class:visible={actionVisible}
			on:click={mobile ? mobileAction : doAction}
			disabled={songId === "straight" && action.on}
		>
			{@html mobile
				? mobileButtonText
				: buttonText.replace("hi-hat", "<br/>hi-hat")}
		</button>
	{/if}
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		padding: 1em 0;
		min-height: 80px;
		position: relative;
	}
	.muted {
		opacity: 0.5;
	}
	.notes {
		position: relative;
		width: 65%;
		margin-left: 3em;
	}
	.label {
		width: 10%;
		font-family: var(--mono);
	}
	.action-btn {
		font-family: var(--mono);
		font-size: var(--14px);
		visibility: hidden;
		width: 15%;
		max-height: 100%;
		flex-shrink: 0;
		padding: 6px 0;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
	}
	.action-btn.pulse {
		animation: pulse 0.4s infinite alternate;
	}
	.action-btn:active {
		transform: translate(5px, calc(-50% + 5px));
	}
	@keyframes pulse {
		to {
			transform: translate(0, -50%) scale(1.1);
		}
	}
	.action-btn.visible {
		visibility: visible;
	}
	@media (max-width: 600px) {
		.label {
			font-size: var(--12px);
		}
		.notes {
			width: 70%;
			margin-left: 1em;
		}
		.action-btn {
			width: 14%;
		}
	}
</style>
