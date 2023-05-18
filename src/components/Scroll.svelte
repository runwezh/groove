<script>
	import Animation from "$components/Scroll.Animation.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { fade } from "svelte/transition";
	import { soundOn, started, scrollyStep, direction } from "$stores/misc.js";
	import scrollY from "$stores/scrollY.js";

	export let steps;

	let containerEl;
	let sounds = [];
	let soundDurations = [];
	let club;
	let clubVolume = 1;
	let paused;

	$: clubPlaying = !paused;
	$: if ($started && club) club.play();
	$: $scrollyStep, scrollChange();

	const scrollChange = () => {
		if ($started) {
			if ($scrollyStep === undefined) {
				if (club) {
					club.pause();
					club.currentTime = 0;
				}
				if ($scrollY < 1000) $direction = "up";
				else $direction = "down";
			}

			if ($scrollyStep === 0) {
				clubVolume = 1;
			} else {
				clubVolume = 0.2;
			}

			if ($scrollyStep !== undefined) {
				paused = false;

				sounds.forEach((sound, i) => {
					if (i === $scrollyStep) {
						sound.play();
					} else {
						sound.pause();
					}
				});
			}
		}
	};
</script>

<Animation />

<div class="scroll-container" bind:this={containerEl}>
	<Scrolly bind:value={$scrollyStep}>
		{#each steps as { text, classname, sound, showNotes }, i}
			{@const active = i === $scrollyStep && $started}
			{@const paragraph = classname === "quote" ? text.split("~")[0] : text}
			{@const quoted = classname === "quote" ? text.split("~")[1] : null}

			<div
				class="step"
				class:active
				transition:fade
				id={i === 0 ? "start-of-story" : ""}
			>
				<p class={classname}>{@html paragraph}</p>
				{#if quoted}
					<p class="speaker">- {quoted}</p>
				{/if}
			</div>
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
		margin: 40vh 0;
		padding: 1em;
		opacity: 0.2;
		transition: all 200ms ease-out;
		transform: scale(1);
		transform-origin: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: rgb(34, 34, 34, 0.9);
		text-align: left;
	}
	.step:last-child {
		height: auto;
		margin-bottom: 70vh;
	}
	.active {
		opacity: 1;
		transform: scale(1.03);
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

	@media (max-width: 600px) {
		.quote {
			font-size: 1.3em;
		}
	}
</style>
