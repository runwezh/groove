<script>
	import Song from "$components/Song.svelte";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { soundOn } from "$stores/misc.js";

	export let steps;

	let step;
	let top;
	let containerEl;
	let sounds = [];
	let club;
	let clubVolume = 1;

	$: step, scrollChange();

	const scrollChange = () => {
		if (step === undefined && club) {
			club.pause();
			club.currentTime = 0;
		} // TODO: got to restart it when you go backwards

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
	};

	onMount(() => {
		top = containerEl.getBoundingClientRect().top - 100;
		club.play();
	});
</script>

<div class="container" bind:this={containerEl}>
	<Scrolly bind:value={step} {top}>
		{#each steps as { text, type, sound, showNotes }, i}
			{@const active = i === step}
			{@const quote = type === "quote"}
			{@const soundNoNotes = showNotes !== "true" && sound}
			{@const notes = showNotes === "true" && active && sound}

			{#if notes}
				<Song songId={sound} />
			{/if}

			<p class:active class:quote transition:fade>{text}</p>

			{#if soundNoNotes}
				<audio
					bind:this={sounds[i]}
					src={`assets/sound/${sound}.mp3`}
					loop={true}
					muted={!$soundOn}
				/>
			{/if}
		{/each}
	</Scrolly>
</div>

<audio
	bind:this={club}
	src={`assets/sound/club.mp3`}
	loop={true}
	muted={!$soundOn}
	bind:volume={clubVolume}
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
