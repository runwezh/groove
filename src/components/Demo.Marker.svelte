<script lang="ts">
	import { getContext, onMount } from "svelte";
	import mq from "$stores/mq";
	import type { MediaQueryStore } from "$stores/mq";
	import type { Scale } from "d3";
	import type { Writable } from "svelte/store";

	interface SongContext {
		getXScale: () => Writable<Scale<number, number>>;
		getSeek: () => Writable<number>;
		getCurrentBeat: () => Writable<number>;
		getTimeToBeat: () => Writable<Scale<number, number>>;
		getXOffset: () => Writable<number>;
	}

	const { getXScale, getSeek, getCurrentBeat, getTimeToBeat, getXOffset } =
		getContext<SongContext>("song");
	const xScale = getXScale();
	const beat = getCurrentBeat();
	const seek = getSeek();
	const timeToBeat = getTimeToBeat();
	const xOffset = getXOffset();

	let markerEl: HTMLDivElement;
	let moving = false;
	let isReducedMotion = false;
	
	if (typeof window !== 'undefined' && mq.reducedMotion) {
		mq.reducedMotion.subscribe((value: boolean) => {
			isReducedMotion = value;
		});
	}

	const onMouseDown = (e: MouseEvent): void => {
		moving = true;
	};
	const onMouseUp = (): void => {
		moving = false;
	};
	const onMouseMove = (e: MouseEvent): void => {
		if (moving) {
			const leftPx = markerEl.offsetLeft + e.movementX - $xOffset;
			const newBeat = $xScale.invert(leftPx);
			const newSeek = $timeToBeat.invert(newBeat) / 1000;
			$seek = newSeek;
		}
	};

	$: left = `${$xScale($beat) + $xOffset}px`;
</script>

<div
	bind:this={markerEl}
	class="marker"
	class:visible={!isReducedMotion}
	role="button"
	tabindex="0"
	aria-label="音频进度标记"
	style:left={`${$xScale($seek)}px`}
	on:mousedown={onMouseDown}
></div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove}></svelte:window>

<style>
	.marker {
		position: absolute;
		background: var(--color-gray-300);
		opacity: 0.5;
		width: 5px;
		height: 100%;
		z-index: 1000;
		transform: translate(-50%, 0);
		visibility: hidden;
	}
	.marker.visible {
		visibility: visible;
	}
	.marker:hover {
		cursor: move;
	}
</style>
