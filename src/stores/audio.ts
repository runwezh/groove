import { writable } from 'svelte/store';

/**
 * 音频元素数组 store
 * @type {import('svelte/store').Writable<HTMLAudioElement[]>}
 */
export const audioEls = writable([]);

/**
 * 音频时长数组 store
 * @type {import('svelte/store').Writable<number[]>}
 */
export const durations = writable([]);

/**
 * 当前播放的音频索引 store
 * @type {import('svelte/store').Writable<number>}
 */
export const currentTrackI = writable(0);

/**
 * 播放状态 store
 * @type {import('svelte/store').Writable<boolean>}
 */
export const playing = writable(false);

/**
 * 当前播放进度 store
 * @type {import('svelte/store').Writable<number>}
 */
export const seek = writable(0); 