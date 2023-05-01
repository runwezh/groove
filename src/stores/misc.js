import { writable, readable } from "svelte/store";
import { range } from "d3";

export const soundOn = writable(false);
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
			hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
		},
		beatsPerMeasure: 4,
		measures: 4
	}
});
