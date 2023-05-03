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

	$: step, scrollChange();

	const scrollChange = () => {
		if ($started) {
			if (step === undefined && club) {
				club.pause();
				club.currentTime = 0;
			}

			if (step !== 0) {
				clubVolume = 0.2;
			} else {
				clubVolume = 1;
			}

			sounds.forEach((sound, i) => {
				if (i === step) {
					sound.play();
				} else {
					sound.pause();
				}
			});
		}
	};

	$: if ($started) {
		club.play();
	}

	onMount(() => {
		top = containerEl.getBoundingClientRect().top - 100;
	});
</script>

<div class="container" bind:this={containerEl}>
	<Scrolly bind:value={step} {top}>
		{#each steps as { text, type, classname, sound, showNotes }, i}
			{@const active = i === step && $started}
			{@const quote = type === "quote"}
			{@const backgroundSound = showNotes !== "true" && sound}
			{@const notes = showNotes === "true" && sound}

			{#if notes}
				<Demo songId={sound} showing={active} />
			{/if}

			<p class:active class={classname} transition:fade>{text}</p>

			{#if backgroundSound}
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
	src={`assets/sound/intro/club.mp3`}
	loop={true}
	muted={!$soundOn}
	bind:volume={clubVolume}
	preload="auto"
/>

<style>
	.sticky {
		position: sticky;
		top: 0;
	}
	p {
		opacity: 0.2;
		margin: 4em 0;
		transition: opacity 300ms;
	}
	p.active {
		opacity: 1;
	}
	p.quote {
		font-style: italic;
		padding-left: 4em;
	}
</style>
