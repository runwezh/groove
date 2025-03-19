import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

let req: number | null = null;
let prev: number | null = null;
const elapsed: Writable<number> = writable(0);

const tick = (timestamp: number): void => {
	if (!prev) prev = timestamp;
	const diff = Math.round(timestamp - prev);
	prev = timestamp;
	elapsed.update(e => e + diff);
	req = window.requestAnimationFrame(tick);
};

interface Timer {
	start: () => void;
	stop: () => void;
	toggle: () => void;
	set: (val: number) => void;
	reset: () => void;
}

const timer: Timer = {
	start() {
		if (browser && !req) {
			prev = null;
			req = window.requestAnimationFrame(tick);
		}
	},
	stop() {
		if (browser && req) {
			window.cancelAnimationFrame(req);
			req = null;
		}
	},
	toggle() {
		req ? timer.stop() : timer.start();
	},
	set(val: number) {
		elapsed.set(val);
	},
	reset() {
		elapsed.set(0);
	}
};

export { timer, elapsed }; 