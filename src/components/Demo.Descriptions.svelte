<script>
	import { getContext } from "svelte";

	export let notes;

	const { getCurrentActionIndex, getPlayClicked } = getContext("song");
	const currentActionIndex = getCurrentActionIndex();
	const playClicked = getPlayClicked();

	$: console.log($currentActionIndex);

	let finished = false;
	$: if ($currentActionIndex === notes.length - 1) finished = true;

	const onClick = (i) => {
		if (finished) $currentActionIndex = i;
	};
</script>

<div class="wrapper" class:visible={$playClicked}>
	{#each notes as note, i}
		<div
			class="bar"
			class:active={i === $currentActionIndex}
			class:clickable={finished}
			on:click={() => onClick(i)}
		/>
		<div class="text" class:visible={i === $currentActionIndex}>{note}</div>
	{/each}
</div>

<style>
	.wrapper {
		display: flex;
		position: relative;
		margin-bottom: 3em;
		visibility: hidden;
	}
	.bar {
		background: #00ffeb;
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
		top: 10px;
		visibility: hidden;
	}
	.visible {
		visibility: visible;
	}
</style>
