<script>
	import { getContext } from "svelte";
	import { soundOn } from "$stores/misc.js";

	export let i;
	export let src;

	const { getAudioEls, getDuration, getCurrentTrackI, getIsPlaying, getSeek } =
		getContext("song");
	const audioEls = getAudioEls();
	const duration = getDuration();
	const currentTrackI = getCurrentTrackI();
	const isPlaying = getIsPlaying();
	const seek = getSeek();

	let d = 0;
	$: if (i === 0) $duration = d;
	$: muted = !$soundOn;

	$: if ($currentTrackI === i && $isPlaying && $audioEls.length) {
		trackTime();
	}
	const trackTime = () => {
		$seek = $audioEls[i]?.currentTime;
		requestAnimationFrame(trackTime);
	};
</script>

<audio
	preload="none"
	bind:this={$audioEls[i]}
	bind:duration={d}
	{src}
	{muted}
/>
