<script>
	import Icon from "$components/helpers/Icon.svelte";
	import { timeFormat, scaleLinear } from "d3";
	import { currentAudioId } from "$stores/misc.js";
	import _ from "lodash";

	export let url;
	export let song;
	export let artist;

	let audioEl;
	let paused = true;
	let duration;
	let seek = 0;

	const clockStr = (sec) => {
		const date = new Date(null);
		date.setSeconds(sec);
		const formatter = timeFormat("%M:%S");
		return formatter(date);
	};

	const pausePlay = () => {
		if (paused) {
			audioEl.play();
			$currentAudioId = _.kebabCase(song);
		} else {
			audioEl.pause();
			$currentAudioId = undefined;
		}
	};

	$: light = artist === "Sungazer";
	$: xScale = scaleLinear().domain([0, duration]).range([0, 100]);
	$: width = `${xScale(seek)}%`;
	$: if (seek === duration && audioEl) {
		seek = 0;
		audioEl.pause();
	}
	$: $currentAudioId, audioChange();
	const audioChange = () => {
		if ($currentAudioId && $currentAudioId !== _.kebabCase(song) && !paused) {
			audioEl.pause();
			seek = 0;
		}
	};
</script>

<div class="container">
	<div class="description"><strong>{song}</strong> by {artist}</div>

	<audio
		src={url}
		preload="auto"
		bind:this={audioEl}
		bind:paused
		bind:duration
		bind:currentTime={seek}
	/>

	<div class="audio-player">
		<button on:click={pausePlay}>
			{#if paused}
				<Icon name="play" />
			{:else}
				<Icon name="pause" />
			{/if}
		</button>
		<div class="time">{clockStr(seek)} / {clockStr(duration)}</div>
		<div class="bar" class:light>
			<div class="seek" style:width />
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 1.5em 0;
	}
	.description {
		margin: 0 1em 0 0;
		width: 50%;
	}
	.audio-player {
		display: flex;
		align-items: center;
		width: 50%;
	}
	.time {
		font-family: var(--mono);
		font-size: var(--16px);
		transform: translate(0, 5px);
	}
	.bar {
		flex-grow: 1;
		height: 6px;
		background: var(--color-gray-800);
		margin: 0 0.5em;
		border-radius: 3px;
		position: relative;
	}
	.bar.light {
		background: var(--color-gray-300);
	}
	.seek {
		background: var(--accent);
		height: 6px;
		border-radius: 3px;
		position: absolute;
		top: 0;
		left: 0;
	}
	button {
		margin-right: 1em;
	}
	@media (max-width: 600px) {
		.container {
			flex-direction: column;
			align-items: flex-start;
		}
		.description {
			margin: 0 0 1em 0;
			width: auto;
		}
		.audio-player {
			min-width: 200px;
			width: 80%;
		}
	}
</style>
