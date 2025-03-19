<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { soundOn } from '$stores/misc';
	import { audioEls, seek, durations, playing } from '$stores/audio';
	import { writable, type Writable } from 'svelte/store';

	export let i: number;
	export let src: string;

	interface AudioContext {
		getAudioEls: () => HTMLAudioElement[];
		getDuration: () => number[];
		getCurrentTrackI: () => number;
		getIsPlaying: () => boolean;
		getSeek: () => number;
	}

	// 添加浏览器环境检查
	const isBrowser = typeof window !== 'undefined';
	
	// 获取 context 并提供默认值以避免服务器端渲染错误
	const context = isBrowser ? (getContext('audio') as AudioContext | undefined) : undefined;
	
	// 提供默认值
	const getAudioEls = context?.getAudioEls || (() => []);
	const getDuration = context?.getDuration || (() => []);
	const getCurrentTrackI = context?.getCurrentTrackI || (() => 0);
	const getIsPlaying = context?.getIsPlaying || (() => false);
	const getSeek = context?.getSeek || (() => 0);

	let audioEl: HTMLAudioElement;
	let d = 0;
	let animationFrame: number;
	let currentTime = 0;
	let ended = false;
	let paused = !getIsPlaying();

	const state = {
		audioEls: getAudioEls(),
		duration: getDuration(),
		currentTrackI: getCurrentTrackI(),
		isPlaying: getIsPlaying(),
		muted: !$soundOn,
		seek: getSeek()
	};

	$: if (isBrowser) {
		state.audioEls = getAudioEls();
		state.duration = getDuration();
		state.currentTrackI = getCurrentTrackI();
		state.isPlaying = getIsPlaying();
		state.muted = !$soundOn;
		state.seek = getSeek();
		paused = !state.isPlaying;
	}

	$: if (isBrowser && i === 0 && Array.isArray(state.duration)) {
		state.duration[i] = d;
	}

	$: if (isBrowser && state.currentTrackI === i && state.isPlaying && state.audioEls.length) {
		handleTrackTime();
	}

	const handleTrackTime = () => {
		if (!isBrowser || !audioEl) return;
		
		if (state.currentTrackI === i) {
			if (state.isPlaying) {
				audioEl.play().catch((error: Error) => console.error('播放错误:', error));
			} else {
				audioEl.pause();
			}
		} else {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
	};

	const handleAnimationFrame = () => {
		if (!isBrowser || !audioEl) return;
		
		if (state.currentTrackI === i && state.isPlaying && state.audioEls.length) {
			currentTime = audioEl.currentTime;
			animationFrame = requestAnimationFrame(handleAnimationFrame);
		}
	};

	onMount(() => {
		if (isBrowser && state.audioEls[i]) {
			state.audioEls[i].load();
		}
	});

	onDestroy(() => {
		if (isBrowser && animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

{#if isBrowser}
<audio
	preload="auto"
	bind:this={audioEl}
	bind:currentTime
	bind:duration={d}
	bind:ended
	bind:paused
	{src}
	muted={state.muted}
></audio>
{/if}
