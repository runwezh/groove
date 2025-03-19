<script lang="ts">
	import { soundOn } from "$stores/misc";
	import { onMount, onDestroy } from "svelte";

	export let i: number;
	export let src: string;
	export let audioEls: HTMLAudioElement[] = [];
	export let seek = 0;
	export let durations: number[] = [];
	export let playing = false;

	let currentTime = 0;
	let ended = false;
	let paused = true;
	let animationFrame: number;

	$: muted = !$soundOn;

	function handleTimeUpdate() {
		seek = currentTime;
	}

	$: if (playing) {
		audioEls[i]?.play();
	} else {
		audioEls[i]?.pause();
	}

	$: if (playing) {
		handleTrackTime();
	}

	const handleTrackTime = () => {
		if (playing && audioEls[i]) {
			seek = audioEls[i].currentTime;
			animationFrame = requestAnimationFrame(handleTrackTime);
		} else {
			cancelAnimationFrame(animationFrame);
		}
	};

	onMount(() => {
		if (audioEls[i]) {
			audioEls[i].addEventListener("ended", () => {
				audioEls[i].currentTime = 0;
				audioEls[i].play();
			});
		}
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<audio
	class="intro-audio"
	bind:this={audioEls[i]}
	bind:currentTime={seek}
	bind:duration={durations[i]}
	bind:ended
	bind:paused={playing}
	src={src}
	on:timeupdate={handleTimeUpdate}
	{muted}
></audio>
