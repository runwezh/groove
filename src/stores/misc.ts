import { writable, readable, type Writable, type Readable } from "svelte/store";
import { range } from "d3";

interface Note {
	time: number;
}

interface InstrumentData {
	instrument: string;
	style: string;
	data: number[];
}

interface ActionData {
	instrument: string;
	description: string;
	style: string;
}

interface SongConfig {
	parts: InstrumentData[];
	defaultStyles: Record<string, string>;
	actionsData?: ActionData[];
	beatsPerMeasure: number;
	measures: number;
	autoplay?: boolean;
	gridlines?: boolean;
	highlighted?: Record<string, number[]>;
}

interface SongDataStore {
	normal: SongConfig;
	drunk: SongConfig;
	straight: SongConfig;
	swing: SongConfig;
	shift: SongConfig;
	dilla: SongConfig;
	erykah: SongConfig;
	money: SongConfig;
	heart: SongConfig;
}

export const started: Writable<boolean> = writable(false);
export const soundOn: Writable<boolean> = writable(true);
export const userMuted: Writable<boolean> = writable(false);
export const scrollyStep: Writable<number | undefined> = writable(undefined);
export const direction: Writable<"up" | "down"> = writable("up");
export const currentAudioId: Writable<string | undefined> = writable(undefined);
export const ios: Writable<boolean> = writable(false);

const everyOther = <T>(arr: T[]): T[] =>
	arr.reduce((acc: T[], d: T, i: number) => (i % 2 === 1 ? acc.concat(d) : acc), []);

const missingKick: InstrumentData = {
	instrument: "kick",
	style: "missing",
	data: []
};
const straightKick: InstrumentData = { instrument: "kick", style: "straight", data: [0, 2] };
const moneyKick: InstrumentData = {
	instrument: "kick",
	style: "money",
	data: [1.5, 2, 3, 3.5]
};

const missingSnare: InstrumentData = {
	instrument: "snare",
	style: "missing",
	data: []
};
const straightSnare: InstrumentData = { instrument: "snare", style: "straight", data: [1, 3] };
const shiftedSnare: InstrumentData = {
	instrument: "snare",
	style: "shift",
	data: [0.88, 2.88]
};

const missingHihat: InstrumentData = {
	instrument: "hihat",
	style: "missing",
	data: []
};
const straightHihat: InstrumentData = {
	instrument: "hihat",
	style: "straight",
	data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
};
const tripletHihat: InstrumentData = {
	instrument: "hihat",
	style: "triplet",
	data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
};
const erykahHihat: InstrumentData = {
	instrument: "hihat",
	style: "erykah",
	data: [0.1, 0.6, 1.1, 1.6, 2.1, 2.6, 3.1, 3.6]
};
const quintupletHihat: InstrumentData = {
	instrument: "hihat",
	style: "quintuplet",
	data: [0, 0.6, 1, 1.6, 2, 2.6, 3, 3.6]
};
const moneyHihat: InstrumentData = {
	instrument: "hihat",
	style: "money",
	data: [0, 0.52, 1, 1.52, 2, 2.52, 3, 3.52]
};

const missingBass: InstrumentData = {
	instrument: "bass",
	style: "missing",
	data: []
};
const straightBass: InstrumentData = {
	instrument: "bass",
	style: "straight",
	data: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
};
const tripletBass: InstrumentData = {
	instrument: "bass",
	style: "triplet",
	data: [0, 0.666, 1, 1.666, 2, 2.666, 3, 3.666]
};
const quintupletBass: InstrumentData = {
	instrument: "bass",
	style: "dilla",
	data: [0, 0.6, 1, 1.6, 2, 2.6, 3, 3.6]
};
const erykahSynth: InstrumentData = {
	instrument: "synth",
	style: "erykah",
	data: [0.1, 0.6, 1.1, 1.6, 2.1, 2.6, 3.1, 3.6]
};

export const songData: Readable<SongDataStore> = readable({
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
		actionsData: [
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
		actionsData: [
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
		actionsData: [
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
		actionsData: [
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
	},
	erykah: {
		parts: [erykahHihat, erykahSynth, straightKick, straightSnare],
		defaultStyles: {
			hihat: "erykah",
			synth: "erykah",
			kick: "straight",
			snare: "straight"
		},
		actionsData: [],
		beatsPerMeasure: 4,
		measures: 8,
		highlighted: {
			synth: erykahSynth.data,
			hihat: erykahHihat.data
		}
	},
	money: {
		parts: [moneyHihat, moneyKick, shiftedSnare],
		defaultStyles: {
			hihat: "money",
			kick: "money",
			snare: "shift"
		},
		actionsData: [],
		beatsPerMeasure: 4,
		measures: 4,
		highlighted: {
			hihat: moneyHihat.data,
			kick: moneyKick.data,
			snare: shiftedSnare.data
		}
	},
	heart: {
		parts: [
			quintupletHihat,
			straightBass,
			straightKick,
			straightSnare,
			shiftedSnare
		],
		defaultStyles: {
			hihat: "quintuplet",
			bass: "straight",
			kick: "straight",
			snare: "straight"
		},
		actionsData: [
			{
				instrument: "snare",
				description: "shift the snare",
				style: "shift"
			}
		],
		beatsPerMeasure: 4,
		measures: 4,
		highlighted: {
			hihat: quintupletHihat.data
		}
	}
}); 