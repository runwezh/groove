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
		getIsPlaying,
		style,
		song,
		artist
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
	$: trimOff = songId === "heart" ? 300 : songId === "money" ? 500 : 1300;
	$: $trimmedDuration = $duration * 1000 - trimOff;
	$: intro = songId === "normal" || songId === "drunk";
	$: pulse = !$playClicked && style !== "real";
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
</script>

{#if !autoplay}
	<div class="buttons">
		{#if song && artist}
			<h3>{song} by {artist}</h3>
		{/if}
		<button on:click={$isPlaying ? pause : play} class:pulse
			>{$isPlaying ? "pause" : "play"}</button
		>
	</div>
{/if}

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
		margin-right: 0.8em;
	}
	.buttons {
		margin-bottom: 2em;
		display: flex;
		align-items: center;
	}
	h3 {
		display: inline;
		font-family: var(--mono);
		margin-right: 1em;
	}
</style>
