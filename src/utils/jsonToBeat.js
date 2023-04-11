import { scaleLinear } from "d3";

const codes = {
	hihat: [45, 42, 44],
	kick: [55, 36, 53],
	snare: [52, 38]
};

const jsonToBeat = (id, json, beatsPerMeasure) => {
	const bpm = json.header.tempos[0].bpm;
	const ppq = json.header.ppq;
	const msPerTick = 60000 / bpm / ppq;
	const endTicks = json.tracks[0].endOfTrackTicks;

	const beatScale = scaleLinear()
		.domain([0, (msPerTick * endTicks) / 1000])
		.range([0, beatsPerMeasure]);

	const beats = json.tracks[0].notes.map((d) => ({
		beat: beatScale(d.time),
		instrument: d.midi
	}));

	console.log({ beats });

	return {
		hihat: beats
			.filter((d) => codes.hihat.includes(d.instrument))
			.map((d) => d.beat),
		snare: beats
			.filter((d) => codes.snare.includes(d.instrument))
			.map((d) => d.beat),
		kick: beats
			.filter((d) => codes.kick.includes(d.instrument))
			.map((d) => d.beat)
	};
};

export default jsonToBeat;
