import { derived, type Readable } from "svelte/store";

export const previous = <T>(store: Readable<T>): Readable<T | null> => {
	let p: T | null = null;

	return derived(store, (current: T) => {
		const previous = p;
		p = current;
		return previous;
	});
}; 