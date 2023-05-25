<script>
	import { soundOn } from "$stores/misc.js";
	import { AlignCenter } from "lucide-svelte";
	import { getContext } from "svelte";

	const {
		getAudioEls,
		getSeek,
		getDuration,
		getInstrumentToggles,
		getInstrumentStyles
	} = getContext("song");
	const audioEls = getAudioEls();
	const seek = getSeek();
	const duration = getDuration();
	const instrumentToggles = getInstrumentToggles();
	const instrumentStyles = getInstrumentStyles();

	export let preload;
	export let classname;
	export let src;
	export let i;
	export let instrument;
	export let style;

	let d = 0;
	let paused;
	$: $duration = d;

	$: muted =
		!$soundOn ||
		$instrumentToggles[instrument] === "off" ||
		$instrumentStyles[instrument] !== style;

	$: muted, align();

	const align = () => {
		if ($audioEls && $audioEls.length && !paused) {
			console.log("align");
			$audioEls.forEach((audioEl) => {
				audioEl.currentTime = $seek;
			});
		}
	};
</script>

{#if classname === "leader"}
	<audio
		{preload}
		class={classname}
		bind:duration={d}
		bind:currentTime={$seek}
		bind:this={$audioEls[i]}
		bind:paused
		{src}
		{muted}
	/>
{:else}
	<audio {preload} bind:this={$audioEls[i]} {src} {muted} />
{/if}
