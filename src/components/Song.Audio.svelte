<script>
	import { getContext, onMount } from "svelte";
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

	onMount(() => {
		$audioEls[0].addEventListener("durationchange", () => {
			$duration = $audioEls[0].duration;
		});
	});
</script>

{#each $allParts as { instrument, style }, i}
	{@const src = `assets/sound/${style}/${instrument}.mp3`}
	{@const muted =
		!$soundOn ||
		$instrumentToggles[instrument] === "off" ||
		$instrumentStyles[instrument] !== style}

	<p>{src}</p>
	{#if i === 0}
		<audio bind:currentTime={$seek} bind:this={$audioEls[i]} {src} {muted} />
	{:else}
		<audio bind:this={$audioEls[i]} {src} {muted} />
	{/if}
{/each}
