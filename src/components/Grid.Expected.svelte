<script>
	import { getContext } from "svelte";

	export let height;
	export let width;
	export let x;

	const { isPlayable } = getContext("song");
</script>

<div
	class="expected-note"
	style:height={`${height}px`}
	style:width={`${width}px`}
	style:left={`${x}px`}
>
	{#if isPlayable}
		<div class="ghost" />
	{/if}
</div>

<style>
	.expected-note {
		position: absolute;
		background: none;
		border-top: 3px solid var(--color-gray-500);
		border-bottom: 3px solid var(--color-gray-500);
		border-left: 3px solid var(--color-gray-500);
	}
	.expected-note:last-of-type {
		border-right: 3px solid var(--color-gray-500);
	}
	.ghost {
		position: absolute;
		background: var(--color-gray-100);
		width: 16px;
		height: 100%;
		left: 0;
		stroke-dasharray: 8px;
		border: 1px dashed var(--color-gray-400);
	}
</style>
