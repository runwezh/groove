<script>
	import viewport from "$stores/viewport.js";

	export let data;
	export let xScale;
	export let currentBeat;

	$: r = $viewport.width < 600 ? 5 : 10;
</script>

<line
	x1={0}
	y1={0}
	x2={xScale(currentBeat)}
	y2={0}
	class:visible={data.length}
/>
{#each data as note, i (i)}
	{@const cx = xScale(note)}
	{@const played = currentBeat >= note - 0.05}
	<circle id={i} class:played {r} fill="lightgrey" {cx} cy={0} />
{/each}

<style>
	line {
		stroke: var(--accent);
		stroke-width: 3px;
		visibility: hidden;
	}
	.visible {
		visibility: visible;
	}
	circle {
		transition: cx calc(var(--1s) * 1.5) ease-in-out;
	}
	circle.played {
		fill: var(--accent);
		animation: calc(var(--1s) * 0.3) ease-in-out grow;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes grow {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
