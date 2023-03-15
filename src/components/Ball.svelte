<script>
	import { Howl } from "howler";
	import { getContext } from "svelte";
	import { tweened } from "svelte/motion";
	import { easeCubicOut, easeCubicIn, easeQuadIn } from "d3-ease";
	import { Droplet } from "lucide-svelte";

	export let data;
	export let id;
	export let i;

	const { getT, beatsPerRotation, getCycleDuration } = getContext("song");
	const t = getT();
	const duration = getCycleDuration();
	const r = 40;
	const cy = tweened(400 - r);
	$: msInBeat = duration / beatsPerRotation;
	$: playing = data.some((d) => Math.abs($t, d) < 0.1);

	const sounds = {
		hihat: new Howl({
			src: ["assets/sound/hihat.mp3"]
		}),
		kick: new Howl({
			src: ["assets/sound/kick.mp3"]
		}),
		snare: new Howl({
			src: ["assets/sound/snare.mp3"]
		})
	};

	const start = () => {
		rise(msInBeat);
	};
	const rise = (dur) => {
		cy.set(r, { duration: dur, easing: easeCubicOut }).then(() =>
			fall(msInBeat)
		);
	};
	const fall = (dur) => {
		cy.set(400 - r, { duration: dur, easeQuadIn });
	};

	const buffer = 0.05;
	$: hitGround = $t >= 1 && $t < 1 + buffer;
	$: if (hitGround) playNote();

	const playNote = () => {
		fall(msInBeat / 2);
	};

	// $: console.log($t);
</script>

<!-- <circle
	class:playing
	fill="cornflowerblue"
	{r}
	cx={r}
	cy={$cy}
	on:click={start}
/> -->

<div class="ball" style={`transform: translateY(${$cy}px)`} />
<button on:click={start}>start</button>

<style>
	.ball {
		height: 50px;
		width: 50px;
		background-color: red;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 50%;
		/* animation: bounce 0.9s infinite; */
	}

	@keyframes bounce-down {
		0% {
			transform: translateY(0px);
		}
		100% {
			transform: translateY(240px);
		}
	}

	@keyframes bounce-up {
		0% {
			transform: translateY(240px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	@keyframes bounce {
		10% {
			height: 50px;
			width: 50px;
		}
		/* 30% {
			height: 50px;
			width: 40px;
		} */
		40% {
			/* height: 30px;
			width: 57px; */
			transform: translateY(240px);
		}
		75% {
			/* height: 50px;
			width: 57px; */
		}
		100% {
			transform: translateY(0px);
		}
	}
</style>
