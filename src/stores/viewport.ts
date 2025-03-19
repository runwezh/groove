import { browser } from "$app/environment";
import { readable, type Readable } from "svelte/store";
import debounce from "lodash.debounce";

interface Viewport {
	width: number;
	height: number;
}

const viewport: Readable<Viewport> = readable({ width: 0, height: 0 }, (set) => {
	const onResize = (): void => set({ width: window.innerWidth, height: window.innerHeight });
	const debouncedResize = debounce(onResize, 250);

	if (browser) {
		onResize();
		window.addEventListener("resize", debouncedResize);
	}

	return () => {
		if (browser) window.removeEventListener("resize", debouncedResize);
	};
});

export default viewport; 