import { writable, type Writable } from "svelte/store";

const reducedMotion: Writable<boolean> = writable(false);

export default reducedMotion; 