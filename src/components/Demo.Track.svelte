<script>
	import { soundOn } from "$stores/misc.js";
	import { getContext } from "svelte";

	export let i;
	export let src;
	export let silent = false;

	const {
		getAudioEls,
		getSeek,
		getDuration,
		getCurrentVersionI,
		getIsPlaying
	} = getContext("song");
	const audioEls = getAudioEls();
	const seek = getSeek();
	const duration = getDuration();
	const currentVersionI = getCurrentVersionI();
	const isPlaying = getIsPlaying();

	let d = 0;

	$: muted = !$soundOn || silent;
	$: if (i === 0) $duration = d;

	$: if ($currentVersionI === i && $isPlaying) {
		trackTime();
	}
	const trackTime = () => {
		$seek = $audioEls[i].currentTime;
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
