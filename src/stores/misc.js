import { writable, readable } from "svelte/store";
import { range } from "d3";

export const soundOn = writable(true); // TODO: should be false

// TODO: these should be reogranized around styles

export const songData = readable({
	normal: {
		data: { kick: range(8, 32, 2) },
		beatsPerMeasure: 32,
		measures: 1,
		autoplay: true
	},
	drunk: {
		data: {
			kick: range(8, 32, 2).map((d) => d + Math.floor(Math.random() * 2))
		},
		beatsPerMeasure: 32,
		measures: 1,
		autoplay: true
	},
	straight: {
		data: {
			kick: [0, 2],
			snare: [1, 3],
			hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
			bass: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
		},
		beatsPerMeasure: 4,
		measures: 4
	},
	triplet: {
		parts: [
			{
				instrument: "hihat",
				style: "straight",
				data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
			},
			{
				instrument: "hihat",
				style: "triplet",
				data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
			},
			{
				instrument: "bass",
				style: "straight",
				data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
			},
			{
				instrument: "bass",
				style: "triplet",
				data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
			},
			{ instrument: "kick", style: "straight", data: [0, 2] },
			{ instrument: "snare", style: "straight", data: [1, 3] }
		],
		defaultStyles: {
			hihat: "straight",
			bass: "straight",
			kick: "straight",
			snare: "straight"
		},
		actions: [
			{
				instrument: "hihat",
				description: "swing the hi-hat",
				style: "triplet"
			},
			{
				instrument: "bass",
				description: "swing the bass",
				style: "triplet"
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	},
	shift: {
		data: {
			kick: [0, 2],
			snare: [1, 3],
			hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
			bass: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
		},
		actions: [
			{
				instrument: "snare",
				description: "shift the snare",
				update: [0.9, 2.9]
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	},
	dilla: {
		data: {
			kick: [0, 2],
			snare: [1, 3],
			hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
			bass: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
		},
		actions: [
			{
				instrument: "snare",
				description: "shift the snare",
				update: [0.9, 2.9]
			},
			{
				instrument: "bass",
				description: "swing the bass",
				update: [0, 0.6, 1, 1.6, 2, 2.6, 3, 3.6]
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	}
});
