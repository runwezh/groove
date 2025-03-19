<script lang="ts">
	import Track from "$components/Demo.Track.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { currentAudioId, soundOn } from "$stores/misc";
	import { getContext, onMount } from "svelte";
	import mq from "$stores/mq";

	const {
		songId,
		autoplay,
		getAudioEls,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getPlayClicked,
		getIsPlaying,
		style,
		versions
	} = getContext("song");
	const audioEls = getAudioEls();
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();

	export let play;
	export let pause;
	export let reset;
	export let restartActions;

	let d = 0;
	let t = 0;
	let paused = true;
	
	// 减少动画标志
	let isReducedMotion = false;
	
	// 在客户端环境中更新减少动画状态
	if (typeof window !== 'undefined' && mq.reducedMotion) {
		mq.reducedMotion.subscribe((value: boolean) => {
			isReducedMotion = value;
		});
	}

	onMount(() => {
		if (audioEls[0]) {
			audioEls[0] = audioEls[0];
		}
	});

	$: $duration = d;
	$: trimOff = songId === "heart" ? 300 : songId === "money" ? 500 : 1300;
	$: $trimmedDuration = $duration * 1000 - trimOff;
	$: pulse = !$playClicked && style !== "real" && !isReducedMotion;
	$: if ($duration && $seek * 1000 > $trimmedDuration) {
		reset();
		play();
	}
	$: if (autoplay) {
		reset();
		play();
	}

	$: $currentAudioId, audioChange();
	const audioChange = () => {
		if ($currentAudioId && $currentAudioId !== songId && $isPlaying) {
			pause();
			reset();
		}
	};
</script>

<button
	class="fixed"
	on:click={play}
	class:pulse
	class:visible={!$playClicked && style !== "real"}
	aria-label="play"
>
	<Icon name="play" />
</button>

<div class="buttons">
	<button
		class="static"
		on:click={$isPlaying ? pause : play}
		class:visible={$playClicked || style === "real"}
		aria-label={$isPlaying ? "pause" : "play"}
	>
		{#if $isPlaying}
			<Icon name="pause" />
		{:else}
			<Icon name="play" />
		{/if}
	</button>
	<button
		class="static"
		on:click={restartActions}
		class:visible={$playClicked && style !== "real"}
		aria-label="restart"
	>
		<Icon name="rotate-ccw" />
	</button>
</div>

{#if style === "real"}
	<audio
		preload="none"
		bind:duration={d}
		bind:currentTime={t}
		bind:paused
		bind:this={audioEls[0]}
		src={`assets/sound/real-songs/${songId}.mp3`}
		muted={!$soundOn}
	></audio>
{:else}
	{#each versions as version, i}
		<Track
			{i}
			src={`assets/sound/demo/${songId}/${version}.mp3`}
			silent={songId === "straight" && version === "0000"}
		/>
	{/each}
{/if}

<style>
	.buttons {
		display: flex;
		align-items: center;
	}
	button.fixed {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 40px;
		transform: translate(-50%, -50%);
		z-index: 1000;
	}
	button.fixed:active {
		box-shadow: 0px 0px 0px 0px;
		transform: translate(calc(-50% + 5px), calc(-50% + 5px));
		animation: none;
	}

	button.static {
		position: static;
		margin: 1em 1em 1em 0;
		transform: translate(0, 0);
	}
	button.static:active {
		transform: translate(5px, 5px);
	}
	button {
		visibility: hidden;
		height: 2.5em;
		width: 2.7em;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	button.visible {
		visibility: visible;
	}
	button.pulse {
		animation: pulse 0.4s infinite alternate;
	}
	@keyframes pulse {
		to {
			transform: translate(-50%, -50%) scale(1.1);
		}
	}
</style>
