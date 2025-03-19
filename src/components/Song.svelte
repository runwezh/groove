<script lang="ts">
	import { onMount } from "svelte";
	import { formatTime } from "$utils/formatTime";
	import { xScale } from "$utils/xScale";
	import Icon from "$components/helpers/Icon.svelte";
	import { timeFormat } from "d3";
	import { scaleLinear } from "d3";
	import { soundOn, userMuted } from "$stores/misc";
	import lodash from "lodash";
	import { Play, Pause } from 'lucide-svelte';

	const { debounce } = lodash;

	// 添加浏览器环境检查
	const isBrowser = typeof window !== 'undefined';

	export let url: string;
	export let title: string;
	export let description: string;

	let audioEl: HTMLAudioElement;
	let duration: number = 0;
	let currentTime: number = 0;
	let paused: boolean = true;
	let muted: boolean = false;
	let volume: number = 1;
	let ended: boolean = false;

	const clockStr = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const handlePlayPause = () => {
		if (!isBrowser || !audioEl) return;
		
		if (paused) {
			audioEl.play();
		} else {
			audioEl.pause();
		}
	};

	function handleSeek(e: MouseEvent) {
		if (!isBrowser || !audioEl) return;
		
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const percentage = (e.clientX - rect.left) / rect.width;
		audioEl.currentTime = percentage * duration;
	}

	// 创建一个线性比例尺
	const timeScale = scaleLinear().domain([0, 100]).range([0, 100]);
	
	$: if (duration) {
		timeScale.domain([0, duration]);
	}

	$: {
		if (isBrowser && audioEl && $soundOn && !$userMuted) {
			audioEl.volume = volume;
		} else if (isBrowser && audioEl) {
			audioEl.volume = 0;
		}
	}

	const audioChange = (e: Event): void => {
		const target = e.target as HTMLAudioElement;
		currentTime = target.currentTime;
		duration = target.duration;
	};

	onMount(() => {
		if (audioEl) {
			audioEl.load();
		}
	});

	const handleVolumeChange = debounce((e: Event): void => {
		const target = e.target as HTMLInputElement;
		volume = parseFloat(target.value);
	}, 100);
</script>

<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
	{#if isBrowser}
	<audio
		bind:this={audioEl}
		bind:currentTime
		bind:duration
		bind:ended
		bind:paused
		muted={!$soundOn}
		src={url}
		on:timeupdate={audioChange}
	></audio>
	{/if}

	<div class="flex flex-col md:flex-row items-start gap-4">
		<div class="w-full md:w-1/2">
			<h2 class="text-xl font-bold mb-2">{title}</h2>
			<p class="text-gray-600">{description}</p>
		</div>

		<div class="w-full md:w-1/2">
			<div class="flex items-center gap-4">
				<button
					class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
					on:click={handlePlayPause}
					aria-label={paused ? '播放' : '暂停'}
				>
					<span class="block w-6 h-6 text-center leading-6">
						{#if paused}
							&#9654;
						{:else}
							&#9208;
						{/if}
					</span>
				</button>

				<div class="flex-1">
					<div class="font-mono text-sm mb-1">{formatTime(currentTime)} / {formatTime(duration)}</div>
					<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							class="h-full bg-blue-500"
							style="width: {(currentTime / duration) * 100}%"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
