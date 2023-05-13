<script>
	import { getContext, onMount } from "svelte";

	export let notes;

	const { songId, getCurrentActionIndex, getPlayClicked, getHighlightedNotes } =
		getContext("song");
	const currentActionIndex = getCurrentActionIndex();
	const playClicked = getPlayClicked();

	let textEls = [];
	let maxTextHeight = 0;
	let finished = false;
	$: if ($currentActionIndex === notes.length - 1) finished = true;

	const onClick = (i) => {
		if (finished) $currentActionIndex = i;
	};

	onMount(() => {
		if (notes.length) {
			maxTextHeight = Math.max(
				...textEls.map((el) => el.getBoundingClientRect().height)
			);
		}
	});
</script>

{#if notes.length}
	<div
		class="wrapper"
		class:visible={$playClicked}
		style:height={`${$playClicked ? maxTextHeight + 18 : 0}px`}
	>
		{#each notes as note, i}
			<div
				class="bar"
				class:active={i === $currentActionIndex}
				class:clickable={finished}
				on:click={() => onClick(i)}
			/>
			<div
				bind:this={textEls[i]}
				class="text"
				class:visible={i === $currentActionIndex}
			>
				{note}
			</div>
		{/each}
	</div>
{/if}

<style>
	.wrapper {
		display: flex;
		position: relative;
		margin: 1em 0;
		visibility: hidden;
	}
	.bar {
		background: var(--accent);
		opacity: 0.2;
		height: 10px;
		width: 100px;
		margin: 0 3px;
	}
	.bar.active {
		opacity: 1;
	}
	.bar.clickable:hover {
		cursor: pointer;
	}
	.text {
		position: absolute;
		left: 0;
		top: 18px;
		visibility: hidden;
	}
	.visible {
		visibility: visible;
	}
</style>
