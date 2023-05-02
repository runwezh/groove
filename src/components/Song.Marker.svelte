<script>
	import { getContext } from "svelte";

	const { getXScale, getSeek, getCurrentBeat, getTimeToBeat, getXOffset } =
		getContext("song");
	const xScale = getXScale();
	const beat = getCurrentBeat();
	const seek = getSeek();
	const timeToBeat = getTimeToBeat();
	const xOffset = getXOffset();

	let markerEl;
	let moving = false;

	const onMouseDown = (e) => {
		moving = true;
	};
	const onMouseUp = () => {
		moving = false;
	};
	const onMouseMove = (e) => {
		if (moving) {
			const leftPx = markerEl.offsetLeft + e.movementX - $xOffset;
			const newBeat = $xScale.invert(leftPx);
			const newSeek = $timeToBeat.invert(newBeat) / 1000;
			$seek = newSeek;
		}
	};
</script>

<div
	bind:this={markerEl}
	class="marker"
	style:left={`${$xScale($beat) + $xOffset}px`}
	on:mousedown={onMouseDown}
/>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.marker {
		position: absolute;
		background: var(--color-gray-300);
		opacity: 0.5;
		width: 5px;
		height: 100%;
		z-index: 1000;
		transform: translate(-50%, 0);
	}
	.marker:hover {
		cursor: move;
	}
</style>
