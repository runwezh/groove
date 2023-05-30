<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Quote from "$components/Quote.svelte";
	import { fade } from "svelte/transition";
	import { soundOn, started, scrollyStep, direction } from "$stores/misc.js";
	import scrollY from "$stores/scrollY.js";
	import { tweened } from "svelte/motion";

	export let steps;

	let containerEl;
	let sounds = [];
	let club;
	let paused;
	const clubVolume = tweened(0, { duration: 1000 });

	$: if ($started && club) club.play();
	$: $scrollyStep, scrollChange();
	$: {
		if (club) club.volume = $clubVolume;
	}

	const scrollChange = () => {
		if ($started) {
			if ($scrollyStep === undefined) {
				if (club) {
					clubVolume.set(0).then(() => {
						club.pause();
						club.currentTime = 0;
					});
				}
				if ($scrollY < 1000) $direction = "up";
				else $direction = "down";
			}

			if ($scrollyStep === 0) {
				clubVolume.set(1);
			} else if ($scrollyStep !== undefined) {
				clubVolume.set(0.2);
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

<div class="scroll-container" bind:this={containerEl}>
	<Scrolly bind:value={$scrollyStep}>
		{#each steps as { text, classname, id, source }, i}
			{@const active = i === $scrollyStep && $started}
			{@const paragraph = classname === "quote" ? text.split("~")[0] : text}
			{@const quoted = classname === "quote" ? text.split("~")[1] : null}

			<div
				class="step"
				class:active
				transition:fade
				id={i === 0 ? "start-of-story" : ""}
			>
				{#if quoted}
					<Quote text={paragraph} {quoted} {id} step={i} {source} />
				{:else}
					<p class={classname}>{@html paragraph}</p>
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
		font-size: var(--20px);
		margin: 40vh 0;
		padding: 1em;
		opacity: 0.2;
		transition: all calc(var(--1s) * 0.2) ease-out;
		transform: scale(1);
		transform-origin: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: rgb(30, 40, 45, 0.9);
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
		font-size: 1.8em;
		text-align: start;
	}
	.speaker {
		font-size: 1.2em;
		color: var(--accent);
		text-align: start;
	}
	:global(span.emphasis) {
		color: var(--accent);
		font-weight: bold;
	}

	@media (max-width: 600px) {
		.step {
			font-size: var(--18px);
		}
		.quote {
			font-size: 1.3em;
		}
	}
</style>
