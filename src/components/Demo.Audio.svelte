<script>
	import AudioFile from "$components/Demo.AudioFile.svelte";
	import { getContext } from "svelte";

	const {
		songId,
		autoplay,
		getAllParts,
		getVisible,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getPlayClicked,
		getIsPlaying
	} = getContext("song");
	const allParts = getAllParts();
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();
	const visible = getVisible();

	export let play;
	export let pause;
	export let reset;

	let d = 0;

	$: $duration = d;
	$: $trimmedDuration = $duration * 1000 - 1300;
	$: intro = songId === "normal" || songId === "drunk";
	$: if ($duration && $seek * 1000 > $trimmedDuration) {
		reset();
		play();
	}

	$: if ($visible && autoplay) {
		reset();
		play();
	}
	$: if (!$visible) {
		pause();
	}

	// let audioLoaded = false;
	// $: console.log({ audioLoaded, songId });

	// onMount(() => {
	// 	if (autoplay) loadAudio();
	// 	addLoadListeners();
	// });

	// const loadAudio = () => {
	// 	$audioEls.forEach((audioEl) => audioEl.load());
	// };
	// const addLoadListeners = () => {
	// 	$audioEls.forEach((audioEl) => {
	// 		audioEl.addEventListener("canplaythrough", () => {
	// 			console.log("ready to play", songId);
	// 			audioLoaded = true;
	// 		});
	// 		$audioEls = $audioEls;
	// 	});
	// };

	// $: if ($playClicked) loadAudio();
</script>

{#if !autoplay}
	<div class="buttons">
		<button on:click={$isPlaying ? pause : play} class:pulse={!$playClicked}
			>{$isPlaying ? "pause" : "play"}</button
		>
	</div>
{/if}

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

<style>
	button {
		margin-right: 0.8em;
	}
	.buttons {
		margin-bottom: 2em;
	}
</style>
