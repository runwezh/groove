import { writable, readable } from "svelte/store";
import { range } from "d3";

export const started = writable(false);
export const soundOn = writable(true);
export const scrollyStep = writable(undefined);

const missingKick = {
	instrument: "kick",
	style: "missing",
	data: []
};
const straightKick = { instrument: "kick", style: "straight", data: [0, 2] };

const missingSnare = {
	instrument: "snare",
	style: "missing",
	data: []
};
const straightSnare = { instrument: "snare", style: "straight", data: [1, 3] };
const shiftedSnare = { instrument: "snare", style: "shift", data: [0.9, 2.9] };

const missingHihat = {
	instrument: "hihat",
	style: "missing",
	data: []
};
const straightHihat = {
	instrument: "hihat",
	style: "straight",
	data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
};
const tripletHihat = {
	instrument: "hihat",
	style: "triplet",
	data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
};

const missingBass = {
	instrument: "bass",
	style: "missing",
	data: []
};
const straightBass = {
	instrument: "bass",
	style: "straight",
	data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
};
const tripletBass = {
	instrument: "bass",
	style: "triplet",
	data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
};
const quintupletBass = {
	instrument: "bass",
	style: "dilla",
	data: [0, 0.6, 1, 1.6, 2, 2.6, 3, 3.6]
};

export const songData = readable({
	normal: {
		parts: [{ instrument: "kick", data: range(8, 32, 2), style: "normal" }],
		defaultStyles: { kick: "normal" },
		beatsPerMeasure: 32,
		measures: 1,
		autoplay: true,
		gridlines: false
	},
	drunk: {
		parts: [
			{
				instrument: "kick",
				data: range(8, 32, 2).map((d) => d + Math.floor(Math.random() * 2)),
				style: "drunk"
			}
		],
		defaultStyles: { kick: "drunk" },
		beatsPerMeasure: 32,
		measures: 1,
		autoplay: true,
		gridlines: false
	},
	straight: {
		parts: [
			straightHihat,
			straightBass,
			straightKick,
			straightSnare,
			missingHihat,
			missingBass,
			missingKick,
			missingSnare
		],
		defaultStyles: {
			hihat: "missing",
			bass: "missing",
			kick: "missing",
			snare: "missing"
		},
		actions: [
			{ instrument: "bass", description: "add the bass", style: "straight" },
			{ instrument: "hihat", description: "add the hi-hat", style: "straight" },
			{ instrument: "kick", description: "add the kick", style: "straight" },
			{ instrument: "snare", description: "add the snare", style: "straight" }
		],
		beatsPerMeasure: 4,
		measures: 4
	},
	swing: {
		parts: [
			straightHihat,
			tripletHihat,
			straightBass,
			tripletBass,
			straightKick,
			straightSnare
		],
		defaultStyles: {
			hihat: "straight",
			bass: "straight",
			kick: "straight",
			snare: "straight"
		},
		actions: [
			{
				instrument: "bass",
				description: "swing the bass",
				style: "triplet"
			},
			{
				instrument: "hihat",
				description: "swing the hi-hat",
				style: "triplet"
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	},
	shift: {
		parts: [
			straightHihat,
			straightBass,
			straightKick,
			straightSnare,
			shiftedSnare
		],
		defaultStyles: {
			hihat: "straight",
			bass: "straight",
			kick: "straight",
			snare: "straight"
		},
		actions: [
			{
				instrument: "snare",
				description: "shift the snare",
				style: "shift"
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	},
	dilla: {
		parts: [
			straightHihat,
			straightBass,
			straightKick,
			straightSnare,
			shiftedSnare,
			quintupletBass
		],
		defaultStyles: {
			hihat: "straight",
			bass: "straight",
			kick: "straight",
			snare: "straight"
		},
		actions: [
			{
				instrument: "bass",
				description: "swing the bass",
				style: "dilla"
			},
			{
				instrument: "snare",
				description: "shift the snare",
				style: "shift"
			}
		],
		beatsPerMeasure: 4,
		measures: 4
	}
});
