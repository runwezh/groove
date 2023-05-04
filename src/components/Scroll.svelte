<script>
	import Demo from "$components/Demo.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { soundOn, started } from "$stores/misc.js";

	export let steps;

	let step;
	let top;
	let containerEl;
	let sounds = [];
	let club;
	let clubVolume = 1;
	let paused;

	$: clubPlaying = !paused;
	$: if ($started && club) club.play();
	$: step, scrollChange();

	const scrollChange = () => {
		if ($started) {
			if (step === undefined && club) {
				club.pause();
				club.currentTime = 0;
			}

			if (step === 0) {
				clubVolume = 1;
			} else {
				clubVolume = 0.2;
			}

			if (step !== undefined) {
				paused = false;

				sounds.forEach((sound, i) => {
					if (i === step) {
						sound.play();
					} else {
						sound.pause();
					}
				});
			}
		}
	};

	onMount(() => {
		top = containerEl.getBoundingClientRect().top - 100;
	});
</script>

<div class="scroll-container" bind:this={containerEl}>
	<Scrolly bind:value={step} {top}>
		{#each steps as { text, classname, sound, showNotes }, i}
			{@const active = i === step && $started}
			{@const notes = showNotes === "true" && sound}

			<!-- {#if notes}
				<Demo songId={sound} showing={active} />
			{/if} -->

			<p class:active class={classname} transition:fade>{text}</p>

			{#if sound}
				<audio
					bind:this={sounds[i]}
					src={`assets/sound/intro/${sound}.mp3`}
					loop={true}
					muted={!$soundOn}
					preload="auto"
				/>
			{/if}
		{/each}
	</Scrolly>
</div>

<audio
	bind:this={club}
	bind:paused
	src={`assets/sound/intro/club.mp3`}
	loop={true}
	muted={!$soundOn}
	bind:volume={clubVolume}
	preload="auto"
/>

<style>
	.scroll-container {
		margin: 8em 0;
	}
	audio {
		display: none;
	}
	.sticky {
		position: sticky;
		top: 0;
	}
	p {
		opacity: 0.2;
		margin: 2em 0;
		transition: all 200ms ease-out;
		transform: scale(1);
		transform-origin: center;
	}
	p.active {
		opacity: 1;
		transform: scale(1.01);
	}
	p.quote {
		font-style: italic;
		padding-left: 4em;
	}
</style>
