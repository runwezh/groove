<script>
	import Demo from "$components/Demo.svelte";
	import Animation from "$components/Scroll.Animation.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { soundOn, started } from "$stores/misc.js";

	export let steps;

	let step;
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
</script>

<Animation {step} />

<div class="scroll-container" bind:this={containerEl}>
	<Scrolly bind:value={step}>
		{#each steps as { text, classname, sound, showNotes }, i}
			{@const active = i === step && $started}
			{@const paragraph = classname === "quote" ? text.split("~")[0] : text}
			{@const quoted = classname === "quote" ? text.split("~")[1] : null}

			<div class="step" class:active transition:fade>
				<p class={classname}>{@html paragraph}</p>
				{#if quoted}
					<p class="speaker">- {quoted}</p>
				{/if}
			</div>

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
	.step {
		height: 80vh;
		opacity: 0.2;
		margin: 2em 0;
		transition: all 200ms ease-out;
		transform: scale(1);
		transform-origin: center;
		text-align: center;
	}
	.step:first-child {
		padding-top: 40vh;
		margin-bottom: 40vh;
	}
	.step:last-child {
		height: auto;
	}
	.active {
		opacity: 1;
		transform: scale(1.01);
	}
	.quote {
		font-size: 2em;
		text-align: start;
	}
	.speaker {
		font-size: 1.5em;
		color: var(--accent);
		text-align: start;
	}
	:global(span.emphasis) {
		color: var(--accent);
		font-weight: bold;
	}
</style>
