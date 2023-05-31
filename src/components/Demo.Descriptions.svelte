<script>
	import { getContext, onMount } from "svelte";
	import viewport from "$stores/viewport.js";

	export let notes;

	const { getCurrentActionIndex, getPlayClicked } = getContext("song");
	const currentActionIndex = getCurrentActionIndex();
	const playClicked = getPlayClicked();

	let textEls = [];
	let maxTextHeight = 0;

	$: if ($viewport.width && $viewport.height) measureMaxHeight();

	const measureMaxHeight = () => {
		if (notes.length) {
			maxTextHeight = Math.max(
				...textEls.map((el) => el.getBoundingClientRect().height)
			);
		}
	};

	onMount(() => {
		measureMaxHeight();
	});
</script>

{#if notes.length}
	<div
		class="wrapper"
		class:visible={$playClicked}
		style:height={`${maxTextHeight + 18}px`}
	>
		{#each notes as note, i}
			<div class="bar" class:active={i === $currentActionIndex} />
			<div
				bind:this={textEls[i]}
				class="text"
				class:visible={i === $currentActionIndex}
			>
				{@html note}
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
		background: var(--yellow);
		opacity: 0.2;
		height: 10px;
		width: 100px;
		margin: 0 3px;
	}
	.bar.active {
		opacity: 1;
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
