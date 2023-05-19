<script>
	import AudioFile from "$components/Demo.AudioFile.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { currentAudioId } from "$stores/misc.js";
	import { getContext } from "svelte";

	const {
		songId,
		autoplay,
		getAllParts,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getPlayClicked,
		getIsPlaying,
		style
	} = getContext("song");
	const allParts = getAllParts();
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();

	export let play;
	export let pause;
	export let reset;

	$: trimOff = songId === "heart" ? 300 : songId === "money" ? 500 : 1300;
	$: $trimmedDuration = $duration * 1000 - trimOff;
	$: intro = songId === "normal" || songId === "drunk";
	$: pulse = !$playClicked && style !== "real";
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
			console.log("pausing", songId);
			pause();
			reset();
		}
	};
</script>

<button
	on:click={$isPlaying ? pause : play}
	class:pulse
	class:started={$playClicked || style === "real"}
>
	{#if $isPlaying}
		<Icon name="pause" />
	{:else}
		<Icon name="play" />
	{/if}
</button>

{#if style === "real"}
	<AudioFile
		src={`assets/sound/real-songs/${songId}.mp3`}
		preload="none"
		classname="leader"
		i={0}
	/>
{:else}
	{#each $allParts as { instrument, style }, i}
		{@const src = `assets/sound/${style}/${instrument}.mp3`}

		{#if style !== "missing"}
			<AudioFile
				{src}
				{instrument}
				{style}
				preload={intro ? "auto" : "none"}
				classname={i === 0 ? "leader" : ""}
				{i}
			/>
		{/if}
	{/each}
{/if}

<style>
	button {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 40px;
		transform: translate(-50%, -50%);
		z-index: 1000;
	}
	button.started {
		position: static;
		margin: 1em 0;
		transform: translate(0, 0);
	}
	button.pulse {
		animation: pulse 0.4s infinite alternate;
	}
	button:active {
		box-shadow: 0px 0px 0px 0px;
		transform: translate(5px, 5px);
	}
	@keyframes pulse {
		to {
			transform: translate(-50%, -50%) scale(1.1);
		}
	}
</style>
