<script>
	import _ from "lodash";
	import { scrollyStep, soundOn } from "$stores/misc.js";

	export let text;
	export let quoted;
	export let id;
	export let step;

	let audioEl;
	let seek = 0;
	let duration;
	let paused;
	let ended;

	$: {
		if (audioEl) {
			if (step === $scrollyStep && !ended) start();
			else if (step !== $scrollyStep) restart();
		}
	}
	const start = () => {
		audioEl.play();
	};
	const restart = () => {
		ended = false;
		paused = true;
		audioEl.pause();
		seek = 0;
	};

	const srcs = {
		"life-changing": "leaving_the_club_edited",
		"undo-education": "no_fucks_edited"
	};
	const emphases = {
		"life-changing": [15, 16, 17, 18, 19, 20],
		"undo-education": [13, 14, 15, 16]
	};
	const words = text.split(" ");
	const data = {
		"life-changing": [
			0.05, 0.2, 0.3, 0.4, 0.55, 1, 1.3, 1.5, 1.8, 2.5, 3, 3.3, 3.5, 4, 4.1,
			4.2, 4.3, 4.6, 5.8, 6.5, 6.7, 6.9, 7.1, 7.3, 7.5, 7.9, 8.1, 8.5, 8.7, 8.9,
			9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 11.4, 11.9, 12.1, 12.9, 13.5, 13.7,
			13.9, 14.3, 14.6, 14.8, 15, 15.1, 15.3
		],
		"undo-education": [
			0.05, 0.2, 0.5, 1.2, 1.5, 3.3, 3.5, 3.7, 4, 4.5, 5.3, 5.5, 5.7, 5.9, 6.1,
			6.3, 6.7, 7.1, 8.2, 9, 9.3, 9.8, 10.3, 11.3, 11.5, 11.9, 12.2, 12.5, 19,
			19.3, 19.5, 19.6, 19.8, 20.2, 20.5, 20.7, 21.3, 21.5, 21.9, 22.1, 22.3,
			22.5, 22.7, 22.9, 23.2
		]
	};
</script>

<p class="quote">
	{#each words as word, i}
		{@const dark = seek >= data[id][i]}
		{@const emphasis = emphases[id].includes(i)}
		<span class:dark class:emphasis>{word} </span>
	{/each}
</p>

<p class="speaker">- {quoted}</p>

<audio
	bind:this={audioEl}
	src={`assets/sound/intro/${srcs[id]}.mp3`}
	bind:currentTime={seek}
	bind:duration
	bind:paused
	bind:ended
	muted={!$soundOn}
/>

<style>
	.quote {
		font-size: 1.8em;
		text-align: start;
	}
	.quote span {
		transition: opacity calc(var(--1s) * 0.3);
		opacity: 0.2;
	}
	.quote span.dark {
		opacity: 1;
	}
	.emphasis {
		font-weight: bold;
	}
	.speaker {
		font-size: 1.2em;
		color: var(--accent);
		text-align: start;
	}
</style>
