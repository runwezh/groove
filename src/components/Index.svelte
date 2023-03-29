<script>
	import Story from "$components/Story.svelte";
	import Toggle from "$components/helpers/Toggle.svelte";
	import Balls from "$components/Balls.svelte";
	import SwingPercentage from "$components/SwingPercentage.svelte";
	import Circular from "$components/Circular.svelte";
	import Linear from "$components/Linear.svelte";
	import { Howl } from "howler";
	import { range, scaleLinear, extent } from "d3";
	import heart from "$data/wtlimh.json";
	import kamaal from "$data/kamaal.json";
	import sincerity from "$data/sincerity.json";

	const swing = (ratio, beats) => {
		return range(beats)
			.map((d) => [d, d + ratio])
			.flat();
	};

	const jsonToBeat = (json, beatsPerMeasure, codes) => {
		const bpm = json.header.tempos[0].bpm;
		const ppq = json.header.ppq;
		const msPerTick = 60000 / bpm / ppq;

		const beatScale = scaleLinear()
			.domain([0, 10.698229166666666]) // TODO: get this from the audio file
			.range([0, beatsPerMeasure]);

		const beats = json.tracks[0].notes.map((d) => ({
			beat: beatScale(d.time),
			instrument: d.midi
		}));

		return {
			hihat: beats
				.filter((d) => d.instrument === codes.hihat)
				.map((d) => d.beat),
			snare: beats
				.filter((d) => d.instrument === codes.snare)
				.map((d) => d.beat),
			kick: beats.filter((d) => d.instrument === codes.kick).map((d) => d.beat)
		};
	};

	// ******

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
		snare: [0.95, 2.95],
		kick: [0, 2]
	};
	const dilla = {
		hihat: swing(4 / 7, 4),
		snare: [0.95, 2.95],
		kick: [0, 2]
	};

	const sincerityAudio = new Howl({
		src: ["assets/sound/sincerity_audio.mp3"]
	});

	const sincerityGroove = jsonToBeat(sincerity, 16, {
		hihat: 45,
		snare: 52,
		kick: 55
	});
</script>

<h3>Sincerity is Scary - The 1975</h3>
<Linear
	audio={sincerityAudio}
	data={sincerityGroove}
	beatsPerRotation={16}
	division={2}
/>
