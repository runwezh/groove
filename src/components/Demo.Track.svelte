<script>
	import { soundOn } from "$stores/misc.js";
	import { getContext, tick } from "svelte";

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
	let f;

	$: muted = !$soundOn || silent;
	$: if (i === 0) $duration = d;

	$: if ($currentVersionI === i && $isPlaying) {
		trackTime();
	}

	const trackTime = () => {
		if ($currentVersionI === i && $isPlaying) {
			$seek = $audioEls[i].currentTime;
			f = requestAnimationFrame(trackTime);
		} else {
			cancelAnimationFrame(f);
		}
	};
</script>

<audio
	preload="none"
	bind:this={$audioEls[i]}
	bind:duration={d}
	{src}
	{muted}
/>
