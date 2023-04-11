<script>
	import { range } from "d3";
	import { getContext } from "svelte";
	import { slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	const { beatsPerRotation, division, getXScale } = getContext("song");
	const xScale = getXScale();
</script>

<div
	class="grid"
	transition:slide={{ delay: 100, duration: 400, easing: quintOut }}
>
	{#each range(0, beatsPerRotation, 1 / division) as bar}
		{@const thick = bar % 1 === 0}
		{@const left = xScale(bar)}

		<div class="group" style:left={`${left}px`}>
			{#if bar % 1 === 0}<div class="number">{(bar % 4) + 1}</div>{/if}
			<div class="line" class:thick />
		</div>
	{/each}
</div>

<style>
	.grid {
		position: absolute;
		height: 40px;
		width: 100%;
		background: #e9cd9a;
		top: 0;
		transform: translate(0, -100%);
	}
	.group {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}
	.line {
		position: absolute;
		background: var(--color-gray-600);
		width: 1px;
		height: 25%;
		bottom: 0;
		/* opacity: 0; */
	}
	.line.visible {
		opacity: 1;
	}
	.thick {
		background: var(--color-gray-800);
		width: 2px;
		height: 40%;
	}
	.number {
		position: absolute;
		font-family: var(--mono);
	}
</style>
