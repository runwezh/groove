<script>
	import { getContext, onMount, tick } from "svelte";
	import { soundOn } from "$stores/misc.js";

	const {
		songId,
		autoplay,
		getAllParts,
		getVisible,
		getDuration,
		getTrimmedDuration,
		getSeek,
		getInstrumentToggles,
		getInstrumentStyles,
		getAudioEls,
		getPlayClicked,
		getIsPlaying
	} = getContext("song");
	const allParts = getAllParts();
	const duration = getDuration();
	const trimmedDuration = getTrimmedDuration();
	const seek = getSeek();
	const instrumentToggles = getInstrumentToggles();
	const instrumentStyles = getInstrumentStyles();
	const audioEls = getAudioEls();
	const playClicked = getPlayClicked();
	const isPlaying = getIsPlaying();
	const visible = getVisible();

	let d;

	$: $duration = d;
	$: $trimmedDuration = $duration * 1000 - 1500;
	$: intro = songId === "normal" || songId === "drunk";
	$: if ($duration && $seek * 1000 > $trimmedDuration) reset();

	$: if ($visible && autoplay) {
		reset();
		play();
	}
	$: if (!$visible) {
		pause();
	}

	const reset = () => {
		$seek = 0;
		play();
	};
	const play = () => {
		if (!$playClicked) {
			// first time play is clicked
			$playClicked = true;
			highlightNextAction();
		}
		$isPlaying = true;
		$audioEls.forEach((el) => {
			el.currentTime = $seek;
			el.play();
		});
	};
	const pause = () => {
		$isPlaying = false;
		$audioEls.forEach((el) => el.pause());
	};
	const highlightNextAction = () => {
		const actionButtons = document.querySelectorAll("button.action-btn");
		if (actionButtons.length) {
			const nextAction = actionButtons[0];
			nextAction.classList.add("visible", "pulse");
		}
	};

	// let audioLoaded = false;
	// $: console.log({ audioLoaded, songId });

	// onMount(() => {
	// 	if (autoplay) loadAudio();
	// 	addLoadListeners();
	// });

	// const loadAudio = () => {
	// 	$audioEls.forEach((audioEl) => audioEl.load());
	// };
	// const addLoadListeners = () => {
	// 	$audioEls.forEach((audioEl) => {
	// 		audioEl.addEventListener("canplaythrough", () => {
	// 			console.log("ready to play", songId);
	// 			audioLoaded = true;
	// 		});
	// 		$audioEls = $audioEls;
	// 	});
	// };

	// $: if ($playClicked) loadAudio();
</script>

{#if !autoplay}
	<button on:click={play} class:pulse={!$playClicked}>play</button>
	<button on:click={pause}>pause</button>
{/if}

{#each $allParts as { instrument, style }, i}
	{@const src = `assets/sound/${style}/${instrument}.mp3`}
	{@const muted =
		!$soundOn ||
		$instrumentToggles[instrument] === "off" ||
		$instrumentStyles[instrument] !== style}

	{#if style !== "missing"}
		{#if i === 0}
			<audio
				preload={intro ? "auto" : "none"}
				class="leader"
				bind:duration={d}
				bind:currentTime={$seek}
				bind:this={$audioEls[i]}
				{src}
				{muted}
			/>
		{:else}
			<audio
				preload={intro ? "auto" : "none"}
				bind:this={$audioEls[i]}
				{src}
				{muted}
			/>
		{/if}
	{/if}
{/each}

<style>
	button {
		margin-right: 0.8em;
	}
</style>
