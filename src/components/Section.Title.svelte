<script>
	import inView from "$actions/inView.js";
	import { onMount } from "svelte";

	export let id;
	export let title;

	let hasAnimation =
		id === "straight" || id === "swing" || id === "shift" || id === "dilla";
	let showTitle = hasAnimation ? false : true;
	let letterEls = [];
	let letterXs = [];

	const onEnter = () => {
		if (hasAnimation) {
			showTitle = true;
		}
	};
	const onExit = () => {
		if (hasAnimation) {
			showTitle = false;
		}
	};

	onMount(() => {
		if (id === "dilla") {
			letterXs = letterEls.map((d) => {
				return d.offsetLeft;
			});
		}
	});
</script>

<h3
	id={`${id}-title`}
	class:visible={showTitle}
	use:inView
	on:enter={onEnter}
	on:exit={onExit}
>
	{#if hasAnimation}
		{#each title.split(" ") as word, i}
			<span class="word">
				{#each word.split("") as letter, j}
					{@const prevWordLetters = title
						.split(" ")
						.slice(0, i)
						.join("").length}
					{@const overallTitleI = prevWordLetters + j}
					<span
						class="letter"
						class:ghost={id === "dilla"}
						bind:this={letterEls[overallTitleI]}>{letter}</span
					>

					{#if id === "dilla"}
						<span
							class="letter dilla"
							style={`--random-left: ${Math.random() * 200}px; --random-top: ${
								Math.random() * 200
							}px; --true-left: ${letterXs[overallTitleI]}px; --delay: ${
								Math.random() * 600
							}ms; --color: ${Math.random() > 0.5 ? "var(--accent)" : "white"}`}
							>{letter}</span
						>
					{/if}
				{/each}
				<span>&nbsp;</span>
			</span>
		{/each}
	{:else}
		{@html title}
	{/if}
</h3>

<style>
	h3 {
		font-family: var(--mono);
		font-size: 4em;
		text-transform: uppercase;
		display: flex;
		flex-wrap: wrap;
	}
	.word {
		display: flex;
		position: relative;
	}
	h3#notes-title {
		font-size: 2.5em;
	}

	/* SWING */
	:global(h3#swing-title .letter:nth-child(2)) {
		transform: translate(0, 0);
		transition: all 1s;
		color: white;
	}
	:global(h3#swing-title.visible .letter:nth-child(2)) {
		transform: translate(15px, 0px);
		color: var(--accent);
	}
	:global(h3#swing-title .letter:nth-child(3)) {
		transform: translate(0, 0);
		transition: all 1s 250ms;
	}
	:global(h3#swing-title.visible .letter:nth-child(3)) {
		transform: translate(10px, 0px);
	}
	:global(h3#swing-title .letter:nth-child(4)) {
		transform: translate(0, 0);
		transition: all 1s 500ms;
		color: white;
	}
	:global(h3#swing-title.visible .letter:nth-child(4)) {
		transform: translate(25px, 0px);
		color: var(--accent);
	}
	:global(h3#swing-title .letter:nth-child(5)) {
		transform: translate(0, 0);
		transition: all 1s 750ms;
	}
	:global(h3#swing-title.visible .letter:nth-child(5)) {
		transform: translate(20px, 0px);
	}

	/* SHIFT */
	:global(h3#shift-title .letter:nth-child(1)) {
		transform: translate(0, 0);
		transition: all 1s 500ms;
		color: white;
	}
	:global(h3#shift-title.visible .letter:nth-child(1)) {
		transform: translate(0, -30px);
		color: var(--accent);
	}

	/* DILLA */
	.ghost {
		opacity: 0;
	}
	.letter.dilla {
		position: absolute;
		z-index: 1000;
		top: var(--random-top);
		left: var(--random-left);
		transition: all 2s var(--delay) ease-in;
		opacity: 0;
	}
	.visible .letter.dilla {
		left: var(--true-left);
		top: 0;
		opacity: 1;
		color: var(--color);
	}
</style>
