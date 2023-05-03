<script>
	import { scaleLinear } from "d3";

	export let beats;
	export let caption;

	const height = 150;
	const width = 200;

	const xScale = scaleLinear().domain([0, 2]).range([0, width]);
</script>

<div class="container">
	<div class="notes" style:height={`${height}px`}>
		{#each beats as beat, i}
			{@const x = xScale(+beat)}
			{@const next = i + 1 < beats.length ? beats[i + 1] : xScale.domain()[1]}
			{@const w = xScale(next) - x}

			<div class="expected" style:width={`${width / 2}px`} />
			<div
				class="note"
				style:width={`${w}px`}
				style:left={`${x}px`}
				class:even={i % 2 === 0}
				class:odd={i % 2 === 1}
			/>
		{/each}
	</div>
	<p>{caption}</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 400px;
	}
	.notes {
		position: relative;
		display: flex;
	}
	.expected {
		height: 100%;
		background: none;
		border: 3px solid var(--color-gray-500);
	}
	.expected:first-of-type {
		border-right: none;
	}
	.note {
		height: 100%;
		position: absolute;
		opacity: 0.6;
	}
	.even {
		background: #fbe6be;
	}
	.odd {
		background: #f4c05c;
	}
</style>
