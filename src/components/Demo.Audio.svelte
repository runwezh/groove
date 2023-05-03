<script>
	import { getContext, onMount, tick } from "svelte";
	import { soundOn } from "$stores/misc.js";

	const {
		getAllParts,
		getDuration,
		getSeek,
		getInstrumentToggles,
		getInstrumentStyles,
		getAudioEls
	} = getContext("song");
	const allParts = getAllParts();
	const duration = getDuration();
	const seek = getSeek();
	const instrumentToggles = getInstrumentToggles();
	const instrumentStyles = getInstrumentStyles();
	const audioEls = getAudioEls();
</script>

{#each $allParts as { instrument, style }, i}
	{@const src = `assets/sound/${style}/${instrument}.mp3`}
	{@const muted =
		!$soundOn ||
		$instrumentToggles[instrument] === "off" ||
		$instrumentStyles[instrument] !== style}

	{#if style !== "missing"}
		{#if i === 0}
			<audio
				bind:duration={$duration}
				bind:currentTime={$seek}
				bind:this={$audioEls[i]}
				{src}
				{muted}
			/>
		{:else}
			<audio bind:this={$audioEls[i]} {src} {muted} />
		{/if}
	{/if}
{/each}
