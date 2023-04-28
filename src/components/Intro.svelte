<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import copy from "$data/copy.json";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let step;
	let top;
	let containerEl;
	let sounds = [];
	let club;

	$: step, scrollChange();

	$: console.log({ step });

	const scrollChange = () => {
		if (step === undefined && club) {
			club.pause();
			club.currentTime = 0;
		} // TODO: got to restart it when you go backwards

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
		{#each copy.intro as { text, sound }, i}
			{@const active = step === i}
			<p class:active transition:fade>{text}</p>
			{#if sound}
				<audio
					src={`assets/sound/intro/${sound}.mp3`}
					loop={true}
					bind:this={sounds[i]}
				/>
			{/if}
		{/each}
	</Scrolly>
</div>

<audio bind:this={club} src={`assets/sound/intro/club.mp3`} loop={true} />

<style>
	.sticky {
		position: sticky;
		top: 0;
	}
	p {
		opacity: 0.2;
		margin: 4em 0;
	}
	p.active {
		opacity: 1;
	}
</style>
