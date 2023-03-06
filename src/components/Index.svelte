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

	const basic = {
		hihat: range(0, 4, 0.5),
		snare: [1, 3],
		kick: [0, 2]
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

<h3>Basic 4/4</h3>
<Circular data={basic} beatsPerRotation={4} division={4} bpm={100} />

<h3>Quintuplet swing with a slightly early snare</h3>
<Circular data={quintuplet} beatsPerRotation={4} division={5} bpm={100} />

<h3>With the love of my heart - Jacob Collier (lots of weird stuff)</h3>
<Circular
	data={withTheLoveInMyHeart}
	beatsPerRotation={5}
	division={7}
	bpm={100}
/>

<SwingPercentage />
