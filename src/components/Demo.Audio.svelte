<script>
	import Icon from "$components/helpers/Icon.svelte";
	import { currentAudioId, soundOn } from "$stores/misc.js";
	import { getContext } from "svelte";
	import mq from "$stores/mq.js";

	const {
		songId,
		autoplay,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getPlayClicked,
		getIsPlaying,
		style,
		getAudioEls,
		getActions
	} = getContext("song");
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();
	const audioEls = getAudioEls();
	const actions = getActions();

	export let play;
	export let pause;
	export let reset;
	export let restartActions;

	let d = 0;
	$: $duration = d;

	$: trimOff = songId === "heart" ? 300 : songId === "money" ? 500 : 1300;
	$: $trimmedDuration = $duration * 1000 - trimOff;
	$: pulse = !$playClicked && style !== "real" && !$mq.reducedMotion;
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

	$: currentVersion = $actions.map((d) => (d.on ? "1" : "0")).join("");
	const versions = {
		straight: ["0000", "1000", "1100", "1110", "1111"],
		swing: ["00", "01", "10", "11"],
		shift: ["0", "1"],
		dilla: ["00", "01", "10", "11"]
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
		bind:currentTime={$seek}
		bind:this={$audioEls[0]}
		src={`assets/sound/real-songs/${songId}.mp3`}
		muted={!$soundOn}
	/>
{:else}
	{#each versions[songId] as version, i}
		{@const leader = i === 0 || (songId === "straight" && i === 1)}
		{@const muted = !$soundOn || currentVersion !== version}
		{@const hasAudio = version !== "0000"}

		{#if hasAudio}
			{#if leader}
				<audio
					preload="none"
					bind:this={$audioEls[i]}
					bind:duration={d}
					bind:currentTime={$seek}
					src={`assets/sound/demo/${songId}/${version}.mp3`}
					{muted}
				/>
			{:else}
				<audio
					preload="none"
					bind:this={$audioEls[i]}
					src={`assets/sound/demo/${songId}/${version}.mp3`}
					{muted}
				/>
			{/if}
		{/if}
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
