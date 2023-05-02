import { writable, readable } from "svelte/store";
import { range } from "d3";

export const soundOn = writable(true); // TODO: should be false

const allStraight = {
	hihat: "straight",
	bass: "straight",
	kick: "straight",
	snare: "straight"
};

const straightKick = { instrument: "kick", style: "straight", data: [0, 2] };

const straightSnare = { instrument: "snare", style: "straight", data: [1, 3] };
const shiftedSnare = { instrument: "snare", style: "shift", data: [0.9, 2.9] };

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
		parts: [straightHihat, straightBass, straightKick, straightSnare],
		defaultStyles: allStraight,
		beatsPerMeasure: 4,
		measures: 4
	},
	triplet: {
		parts: [
			straightHihat,
			tripletHihat,
			straightBass,
			tripletBass,
			straightKick,
			straightSnare
		],
		defaultStyles: allStraight,
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
		parts: [
			straightHihat,
			straightBass,
			straightKick,
			straightSnare,
			shiftedSnare
		],
		defaultStyles: allStraight,
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
		parts: [
			straightHihat,
			straightBass,
			straightKick,
			straightSnare,
			shiftedSnare,
			quintupletBass
		],
		defaultStyles: allStraight,
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
