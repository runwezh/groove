<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { soundOn } from '$stores/misc';
	import { audioEls, durations, currentTrackI, playing as isPlaying, seek } from '$stores/audio';

	export let i: number;
	export let src: string;
	export let silent = false;

	interface AudioContext {
		getAudioEls: () => HTMLAudioElement[];
		getDuration: () => number[];
		getCurrentTrackI: () => number;
		getIsPlaying: () => boolean;
	}

	// 添加默认 context 处理
	const isBrowser = typeof window !== 'undefined';
	const context = isBrowser ? (getContext('audio') as AudioContext | undefined) : undefined;
	
	// 提供默认值，以便服务器端渲染不会崩溃
	const getAudioEls = context?.getAudioEls || (() => []);
	const getDuration = context?.getDuration || (() => []);
	const getCurrentTrackI = context?.getCurrentTrackI || (() => 0);
	const getIsPlaying = context?.getIsPlaying || (() => false);

	let audioEl: HTMLAudioElement;
	let d = 0;
	let animationFrame: number;

	$: if (isBrowser && $audioEls && $audioEls[i]) {
		audioEl = $audioEls[i];
	}

	$: if (isBrowser && i === 0) {
		$durations[i] = d;
	}

	$: if (isBrowser && $currentTrackI === i && $isPlaying && $audioEls && $audioEls.length) {
		handleTrackTime();
	}

	const handleTrackTime = () => {
		if (!isBrowser) return;
		
		if ($currentTrackI === i && $isPlaying && $audioEls && $audioEls.length) {
			$seek = $audioEls[i]?.currentTime;
			animationFrame = requestAnimationFrame(handleTrackTime);
		} else {
			cancelAnimationFrame(animationFrame);
		}
	};

	onMount(() => {
		if ($audioEls && $audioEls[i]) {
			$audioEls[i].load();
		}
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<audio
	preload="none"
	bind:this={audioEl}
	bind:duration={d}
	{src}
	muted={!$soundOn || silent}
></audio>
