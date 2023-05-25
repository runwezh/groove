<script>
	import Note from "$components/Demo.Note.svelte";
	import { getContext } from "svelte";
	import { range } from "d3";
	import _ from "lodash";
	import Icon from "$components/helpers/Icon.svelte";
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
		getInstrumentToggles,
		getInstrumentStyles,
		getHighlightedNotes,
		getWidth,
		getXOffset,
		getInteractionHeight,
		getCurrentAction,
		getCurrentActionIndex,
		style,
		actions
	} = getContext("song");
	const allParts = getAllParts();
	const xScale = getXScale();
	const instrumentToggles = getInstrumentToggles();
	const instrumentStyles = getInstrumentStyles();
	const highlightedNotes = getHighlightedNotes();
	const width = getWidth();
	const xOffset = getXOffset();
	const interactionHeight = getInteractionHeight();
	const currentAction = getCurrentAction();
	const currentActionIndex = getCurrentActionIndex();

	let actionBtn;
	let notesContainer;
	let actionOn = false;
	let actionClickedOnce = false;
	let originalData = data;
	let originalStyle = $instrumentStyles[id];

	const formatLabel = (str) => _.upperFirst(str === "hihat" ? "hi-hat" : str);

	const mute = (id) => {
		$instrumentToggles[id] = $instrumentToggles[id] === "off" ? "on" : "off";
	};

	const doAction = () => {
		if (actionOn) {
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
				const nextAction = actions[$currentActionIndex + 1];
				if (nextAction) {
					$currentAction = nextAction;
				} else {
					$currentAction = undefined;
				}
				$currentActionIndex += 1;

				actionClickedOnce = true;
			}
		}
		actionOn = !actionOn;
	};
	const mobileAction = () => {
		if (actionVisible || (songId === "straight" && current && !actionOn)) {
			doAction();
		}
	};

	$: if ($currentActionIndex === 0) {
		actionOn = false;
		actionClickedOnce = false;
	}
	$: muted = $instrumentToggles[id] === "off";
	$: mobile = $viewport.width < 600;
	$: current = $currentAction && $currentAction.instrument === id;
	$: if ($width && notesContainer) $xOffset = notesContainer.offsetLeft;
	$: buttonText =
		action && actionOn
			? `${songId === "straight" ? "" : "un-"}${action.description}`
			: action && !actionOn
			? `${action.description}`
			: "";
	$: actionVisible =
		actions && $currentActionIndex >= actions.findIndex((d) => d === action);
</script>

<div class="instrument" class:muted>
	{#if mobile && action}
		<div
			class="interaction-layer"
			style:height={`${$interactionHeight}px`}
			style:width={`${$width}px`}
			style:left={`${$xOffset}px`}
			class:current
			class:highlight={actionVisible && !current}
			on:click={mobileAction}
			on:keydown={mobileAction}
		/>
	{/if}

	<div class="label">
		{formatLabel(id)}
		<button
			class="mute"
			class:visible={style !== "real"}
			on:click={() => mute(id)}
			aria-label={muted ? "unmute" : "mute"}
		>
			{#if muted}
				<Icon name="volume-x" />
			{:else}
				<Icon name="volume-2" />
			{/if}
		</button>
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
			on:click={doAction}
			disabled={mobile || (songId === "straight" && actionOn)}
		>
			{@html buttonText.replace("hi-hat", "<br/>hi-hat")}
		</button>
	{/if}
</div>

<style>
	.instrument {
		display: flex;
		align-items: center;
		padding: 1em 0;
		min-height: 50px;
		position: relative;
	}
	button.mute {
		display: block;
		box-shadow: none;
		padding: 0;
		font-size: var(--18px);
		height: 18px;
		border: none;
		background: none;
		visibility: hidden;
	}
	button.mute.visible {
		visibility: visible;
	}
	button.mute:active {
		transform: none;
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
		min-width: 15%;
		font-family: var(--mono);
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
	.action-btn.visible {
		visibility: visible;
	}
	.action-btn.mobile {
		position: absolute;
		right: 0;
		visibility: hidden;
	}
	.interaction-layer {
		position: absolute;
		top: 0;
		z-index: 1000;
	}
	.highlight {
		background: var(--color-gray-300);
		opacity: 0.1;
	}
	.current {
		background: var(--yellow);
		opacity: 0.2;
	}
	.highlight:hover,
	.current:hover {
		cursor: pointer;
	}

	@media (max-width: 600px) {
		.label {
			font-size: var(--12px);
		}
		.notes {
			width: 85%;
			margin-left: 0;
		}
	}
</style>
