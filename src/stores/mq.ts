import { browser } from "$app/environment";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";

export interface MediaQueryStore {
	"20rem": boolean;
	"30rem": boolean;
	"40rem": boolean;
	"50rem": boolean;
	"60rem": boolean;
	"70rem": boolean;
	"80rem": boolean;
	reducedMotion: boolean;
	desktop: boolean;
	classNames: string;
}

const queries = {
	"20rem": "(min-width: 20rem)",
	"30rem": "(min-width: 30rem)",
	"40rem": "(min-width: 40rem)",
	"50rem": "(min-width: 50rem)",
	"60rem": "(min-width: 60rem)",
	"70rem": "(min-width: 70rem)",
	"80rem": "(min-width: 80rem)",
	"reducedMotion": "(prefers-reduced-motion: reduce)",
	"desktop": "(hover: hover) and (pointer: fine)"
} as const;

function calculateMedia(mqls: Record<string, MediaQueryList>): MediaQueryStore {
	const media = { classNames: "" } as MediaQueryStore;
	const mediaClasses: string[] = [];
	for (let name in mqls) {
		media[name as keyof MediaQueryStore] = mqls[name].matches;
		if (media[name as keyof MediaQueryStore]) mediaClasses.push(`mq-${name}`);
	}
	media.classNames = mediaClasses.join(" ");
	return media;
}

const mq: Readable<MediaQueryStore> = readable<MediaQueryStore>({} as MediaQueryStore, (set) => {
	if (!browser) return;
	const mqls: Record<string, MediaQueryList> = {};
	const onChange = () => set(calculateMedia(mqls));

	if (browser) {
		for (let q in queries) {
			mqls[q] = window.matchMedia(queries[q]);
			mqls[q].addListener(onChange);
		}

		onChange();
	}

	return () => {
		for (let q in mqls) {
			mqls[q].removeListener(onChange);
		}
	};
});

export default mq;
