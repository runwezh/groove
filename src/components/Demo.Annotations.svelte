<script>
	import { getContext } from "svelte";
	import Icon from "$components/helpers/Icon.svelte";

	const { songId, getXOffset, getWidth, getHeight } = getContext("song");
	const xOffset = getXOffset();
	const width = getWidth();
	const height = getHeight();

	const annotations = {
		erykah: [
			{
				text: "hi-hat and synth are both swung but also shifted",
				arrows: ["up", "down"],
				left: 14,
				top: 19
			}
		],
		money: [
			{ text: "hi-hat is slightly swung", arrows: ["up"], left: 12, top: 25 },
			{ text: "snare is slightly early", arrows: ["down"], left: 21, top: 68 }
		],
		heart: [
			{
				text: "hi-hat is at a quintuplet swing",
				arrows: ["up"],
				left: 14,
				top: 25
			},
			{ text: "snare is slightly early", arrows: ["down"], left: 21, top: 68 }
		]
	};
	$: currentAnnotations = annotations[songId] || [];
</script>

{#each currentAnnotations as { text, arrows, left, top }}
	{@const leftPx = `${$xOffset + ($width * left) / 100}px`}
	{@const topPx = `${($height * top) / 100}px`}
	{@const maxWidth = $width - leftPx}
	<div
		style:left={leftPx}
		style:top={topPx}
		style:width={`${maxWidth}px`}
		class="annotation"
	>
		<div class="icons">
			{#if arrows.includes("up")}
				<Icon name="corner-left-up" />
			{/if}
			{#if arrows.includes("down")}
				<Icon name="corner-left-down" />
			{/if}
		</div>
		<div
			class="text"
			style:transform={arrows.length === 2
				? "translate(0, -2px)"
				: arrows.includes("up")
				? "translate(0, 2px)"
				: "translate(0, -8px)"}
		>
			{text}
		</div>
	</div>
{/each}

<style>
	.annotation {
		position: absolute;
		font-family: var(--mono);
		color: var(--yellow);
		text-align: center;
		display: flex;
		align-items: center;
	}
	.icons {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.text {
		margin-left: 0.5em;
		background: rgb(51, 45, 75, 0.2);
	}
	@media (max-width: 600px) {
		.annotation {
			font-size: var(--16px);
		}
	}
</style>
