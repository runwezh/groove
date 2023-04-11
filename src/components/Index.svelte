<script>
	import Select from "$components/helpers/Select.svelte";
	import Linear from "$components/Linear.svelte";
	import { Howl } from "howler";
	import { range, scaleLinear, extent } from "d3";
	import kamaal from "$data/kamaal.json";
	import sincerity from "$data/sincerity.json";
	import lightSwitch from "$data/lightSwitch.json";
	import dmatSwung from "$data/dmatSwung.json";
	import dmatStraight from "$data/dmatStraight.json";

	const swing = (ratio, beats) => {
		return range(beats)
			.map((d) => [d, d + ratio])
			.flat();
	};

	const jsonToBeat = (id, json, beatsPerMeasure, codes) => {
		const bpm = json.header.tempos[0].bpm;
		const ppq = json.header.ppq;
		const msPerTick = 60000 / bpm / ppq;
		const endTicks = id === "kamaal" ? 4100 : json.tracks[0].endOfTrackTicks;

		const beatScale = scaleLinear()
			.domain([0, (msPerTick * endTicks) / 1000])
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
	const kamaalAudio = new Howl({
		src: ["assets/sound/kamaal_audio.mp3"]
	});
	const lightSwitchAudio = new Howl({
		src: ["assets/sound/light_switch.mp3"]
	});
	const dmatAudio = new Howl({
		src: ["assets/sound/dmat_audio.mp3"]
	});

	const sincerityGroove = jsonToBeat("sincerity", sincerity, 16, {
		hihat: 45,
		snare: 52,
		kick: 55
	});
	const kamaalGroove = jsonToBeat("kamaal", kamaal, 8, {
		hihat: 42,
		snare: 38,
		kick: 36
	});
	const lightSwitchGroove = jsonToBeat("lightSwitch", lightSwitch, 16, {
		hihat: 44,
		snare: 52,
		kick: 53
	});
	const dmatSwungGroove = jsonToBeat("dmatSwung", dmatSwung, 8, {
		hihat: 42
	});
	const dmatStraightGroove = jsonToBeat("dmatStraight", dmatStraight, 8, {
		hihat: 42
	});

	const options = [
		{
			value: "kamaal",
			name: "Kamaal",
			data: kamaalGroove,
			audio: kamaalAudio,
			beats: 8
		},
		{
			value: "sincerity",
			name: "Sincerity is Scary",
			data: sincerityGroove,
			audio: sincerityAudio,
			beats: 16
		},
		{
			value: "lightSwitch",
			name: "Light Switch",
			data: lightSwitchGroove,
			audio: lightSwitchAudio,
			beats: 16
		},
		{
			value: "dmatSwung",
			name: "It Don't Mean a Thing (swung)",
			data: dmatSwungGroove,
			audio: dmatAudio,
			beats: 8
		},
		{
			value: "dmatStraight",
			name: "It Don't Mean a Thing (straight)",
			data: dmatStraightGroove,
			audio: dmatAudio,
			beats: 8
		}
	];
	let value = "dmatSwung";
	$: current = options.find((d) => d.value === value);
</script>

<div class="select">
	<Select label={"select song"} {options} bind:value />
	<h3 style="margin-top: 3em">{current.name}</h3>
</div>

<Linear
	id={current.value}
	audio={current.audio}
	data={current.data}
	beatsPerRotation={current.beats}
/>

<style>
	.select {
		width: 300px;
	}
</style>
