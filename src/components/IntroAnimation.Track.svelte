<script>
	import { soundOn } from "$stores/misc.js";
	import { onMount } from "svelte";

	export let i;
	export let src;
	export let audioEls;
	export let playing;
	export let seek;
	export let durations;

	let f;
	let paused = true;

	$: muted = !$soundOn;

	$: if (playing && paused) {
		audioEls[i].src = src;
		audioEls[i].currentTime = 0;
		audioEls[i].play();
		paused = false;
	} else if (!playing && !paused) {
		audioEls[i].pause();
		paused = true;
	}

	$: if (playing) {
		trackTime();
	}

	const trackTime = () => {
		if (playing) {
			seek = audioEls[i].currentTime;
			f = requestAnimationFrame(trackTime);
		} else {
			cancelAnimationFrame(f);
		}
	};

	onMount(() => {
		audioEls[i].addEventListener("ended", () => {
			audioEls[i].currentTime = 0;
			audioEls[i].play();
		});
	});
</script>

<audio
	class="intro-audio"
	bind:this={audioEls[i]}
	bind:duration={durations[i]}
	{src}
	{muted}
/>
