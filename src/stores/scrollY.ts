import { browser } from "$app/environment";
import { readable, type Readable } from "svelte/store";

const scrollY: Readable<number> = readable(0, (set) => {
	let ticking = false;
	let lastScrollY = 0;

	const updateScrollY = (): void => {
		set(lastScrollY);
		ticking = false;
	};

	const onScroll = (): void => {
		lastScrollY = window.scrollY;
		if (!ticking) {
			requestAnimationFrame(updateScrollY);
			ticking = true;
		}
	};

	if (browser) document.addEventListener("scroll", onScroll);

	return () => {
		if (browser) document.removeEventListener("scroll", onScroll);
	};
});

export default scrollY; 