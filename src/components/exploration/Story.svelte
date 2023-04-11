<script>
	import Linear from "$components/Linear.svelte";
	import { range } from "d3";
	import copy from "$data/copy.json";
	import Scrolly from "$components/helpers/Scrolly.svelte";

	const swing = (ratio, beats) => {
		return range(beats)
			.map((d) => [d, d + ratio])
			.flat();
	};
	const basic = {
		hihat: range(0, 4, 0.5),
		snare: [1, 3],
		kick: [0, 2]
	};
	const triplet = {
		hihat: swing(2 / 3, 4),
		snare: [1, 3],
		kick: [0, 2]
	};
	const quintuplet = {
		hihat: swing(3 / 5, 4),
		snare: [1, 3],
		kick: [0, 2]
	};
	const dilla = {
		hihat: swing(4 / 7, 4),
		snare: [0.95, 2.95],
		kick: [0, 2]
	};

	const userBeat = { hihat: [0.1, 0.9, 2.1, 2.9] };
	const quantizedUserBeat = { hihat: [0, 1, 2, 3] };

	let currentGroove;
	let step;
	$: step, stepChange();

	const stepChange = () => {
		if (step === undefined || step < 3) currentGroove = userBeat;
		if (step >= 3 && step < 9) currentGroove = quantizedUserBeat;
		if (step >= 9 && step < 12) currentGroove = basic;
		if (step >= 12 && step < 14) currentGroove = triplet;
		if (step >= 14 && step < 16) currentGroove = quintuplet;
		if (step >= 16 && step < 18) currentGroove = basic;
		if (step >= 18) currentGroove = dilla;
	};
</script>

<div>
	<div class="sticky">
		{#if step >= 2}
			<Linear data={currentGroove} beatsPerRotation={4} division={4} bpm={80} />
		{/if}
	</div>

	<div class="steps">
		<Scrolly bind:value={step}>
			{#each [...copy.intro, ...copy.straight, ...copy.swing, ...copy.dilla] as { type, value }}
				<div class="step">
					<p>{@html value}</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</div>

<style>
	.sticky {
		position: sticky;
		top: 2em;
	}
	.steps {
		position: relative;
		pointer-events: none;
	}
	.step {
		padding: 1em;
		background: var(--color-gray-100);
		text-align: center;
		margin: 80vh auto;
		max-width: 600px;
		text-align: center;
	}
	.step p {
		pointer-events: all;
	}
	:global(span.off) {
		background: cornflowerblue;
		color: white;
	}
</style>
