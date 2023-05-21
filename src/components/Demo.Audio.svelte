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
	export let restartActions;

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
>
	<Icon name="play" />
</button>

<div class="buttons">
	<button
		class="static"
		on:click={$isPlaying ? pause : play}
		class:visible={$playClicked || style === "real"}
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
	>
		<Icon name="circle-ccw" />
	</button>
</div>

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
	.buttons {
		display: flex;
		align-items: center;
	}

	button.fixed {
		position: absolute;
		top: 35%;
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
