<script>
	import WavyLine from "$components/Scroll.WavyLine.svelte";
	import { scrollyStep, direction } from "$stores/misc.js";

	let width = 0;

	$: visible = $scrollyStep !== undefined || $direction === "up";

	const yOffset = 150;

	$: $scrollyStep, scrollChange();

	const scrollChange = () => {
		if ($scrollyStep === 2) {
		}
	};
</script>

<div class="wrapper" bind:clientWidth={width} class:visible>
	<svg>
		<g transform={`translate(0, ${yOffset})`}>
			<WavyLine {width} />
		</g>
	</svg>
</div>

<style>
	.wrapper {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0;
		transition: opacity 800ms;
	}
	svg {
		position: fixed;
		top: 20%;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.visible {
		opacity: 1;
	}
	path {
		stroke: white;
		fill: none;
		stroke-width: 10px;
	}
</style>
