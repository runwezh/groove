<script>
	import WavyLine from "$components/Scroll.WavyLine.svelte";
	import { scrollyStep } from "$stores/misc.js";

	let width = 0;

	$: console.log("step", $scrollyStep);
</script>

<div
	class="wrapper"
	bind:clientWidth={width}
	class:visible={$scrollyStep !== undefined}
>
	<svg>
		{#if $scrollyStep !== undefined}
			<WavyLine {width} />
		{/if}
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
		visibility: hidden;
	}
	svg {
		position: fixed;
		top: 20%;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.visible {
		visibility: visible;
	}
</style>
