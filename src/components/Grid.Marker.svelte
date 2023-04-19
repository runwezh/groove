<script>
	import { getContext } from "svelte";

	const { getXScale, getSeek, getCurrentBeat, getTimeToBeat } =
		getContext("song");
	const xScale = getXScale();
	const beat = getCurrentBeat();
	const seek = getSeek();
	const timeToBeat = getTimeToBeat();

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
			const leftPx = markerEl.offsetLeft + e.movementX;
			const newBeat = $xScale.invert(leftPx);
			const newSeek = $timeToBeat.invert(newBeat) / 1000;
			$seek = newSeek;
		}
	};
</script>

<div
	bind:this={markerEl}
	class="marker"
	style:left={`${$xScale($beat)}px`}
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
		transform: translate(-50%, 0);
		z-index: 1000;
	}
	.marker:hover {
		cursor: move;
	}
</style>
