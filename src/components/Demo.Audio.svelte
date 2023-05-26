<script>
	import AudioFile from "$components/Demo.AudioFile.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import { currentAudioId } from "$stores/misc.js";
	import { getContext, onMount } from "svelte";
	import mq from "$stores/mq.js";

	const {
		songId,
		autoplay,
		getAllParts,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getPlayClicked,
		getIsPlaying,
		style,
		getCurrentAction,
		getCurrentActionIndex,
		actions
	} = getContext("song");
	const allParts = getAllParts();
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();
	const currentAction = getCurrentAction();
	const currentActionIndex = getCurrentActionIndex();

	export let play;
	export let pause;
	export let reset;
	export let restartActions;

	$: trimOff = songId === "heart" ? 300 : songId === "money" ? 500 : 1300;
	$: $trimmedDuration = $duration * 1000 - trimOff;
	$: intro = songId === "normal" || songId === "drunk";
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

	// New
	let audioCtx;
	let offset = 0;
	let tracks;

	$: console.log({ tracks, audioCtx });

	const getFile = async (filepath) => {
		const response = await fetch(filepath);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
		return audioBuffer;
	};
	async function loadFile(filePath) {
		const track = await getFile(filePath);
		return track;
	}
	function playTrack(audioBuffer) {
		const trackSource = new AudioBufferSourceNode(audioCtx, {
			buffer: audioBuffer
		});
		trackSource.connect(audioCtx.destination);

		if (offset == 0) {
			trackSource.start();
			offset = audioCtx.currentTime;
		} else {
			trackSource.start(0, audioCtx.currentTime - offset);
		}
		return trackSource;
	}
	const playNew = () => {
		tracks.forEach((track) => {
			playTrack(track);
		});
		if (!$playClicked) {
			$playClicked = true;
			$currentAction = actions[0];
			$currentActionIndex = 0;
		}
		$isPlaying = true;
		$currentAudioId = songId;
	};
	const pauseNew = () => {};

	onMount(async () => {
		audioCtx = new AudioContext();

		const files = [
			"assets/sound/straight/bass.mp3",
			"assets/sound/straight/hihat.mp3",
			"assets/sound/straight/kick.mp3",
			"assets/sound/straight/snare.mp3"
		];
		tracks = await Promise.all(files.map(loadFile));
	});
</script>

<button
	class="fixed"
	on:click={playNew}
	class:pulse
	class:visible={!$playClicked && style !== "real"}
	aria-label="play"
>
	<Icon name="play" />
</button>

<div class="buttons">
	<button
		class="static"
		on:click={$isPlaying ? pauseNew : playNew}
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

<!-- {#if style === "real"}
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
{/if} -->
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
