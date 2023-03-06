<script>
	import SwingPercentage from "$components/SwingPercentage.svelte";
	import Circular from "$components/Circular.svelte";
	import Linear from "$components/Linear.svelte";
	import { range, scaleLinear, extent } from "d3";
	import heart from "$data/wtlimh.json";

	const swing = (ratio, beats) => {
		return range(beats)
			.map((d) => [d, d + ratio])
			.flat();
	};

	const quintuplet = {
		hihat: swing(3 / 5, 4),
		snare: [0.95, 2.95],
		kick: [0, 2]
	};

	const bpm = heart.header.tempos[0].bpm;
	const ppq = heart.header.ppq;
	const msPerTick = 60000 / bpm / ppq;

	const beatScale = scaleLinear()
		.domain(extent(heart.tracks[0].notes.map((d) => d.ticks)))
		.range([0, 5]);

	const beats = heart.tracks[0].notes.map((d) => ({
		beat: beatScale(d.ticks),
		instrument: d.midi
	}));

	const withTheLoveInMyHeart = {
		hihat: beats.filter((d) => d.instrument === 42).map((d) => d.beat),
		snare: beats.filter((d) => d.instrument === 38).map((d) => d.beat),
		kick: beats.filter((d) => d.instrument === 36).map((d) => d.beat)
	};
</script>

<SwingPercentage />

<h3>Quintuplet swing</h3>
<Circular data={quintuplet} beatsPerRotation={4} division={5} bpm={100} />

<h3>With the love of my heart - Jacob Collier</h3>
<Circular
	data={withTheLoveInMyHeart}
	beatsPerRotation={5}
	division={7}
	bpm={100}
/>
