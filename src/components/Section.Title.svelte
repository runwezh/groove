<script>
	import inView from "$actions/inView.js";
	import _ from "lodash";
	import mq from "$stores/mq.js";

	export let id;
	export let title;

	let hasAnimation =
		id === "straight" || id === "swing" || id === "shift" || id === "dilla";
	let showTitle = hasAnimation ? false : true;

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
					{@const randomX = _.random(-50, 50)}
					{@const randomY = _.random(-50, 50)}
					{@const randomRotate = _.random(-30, 30)}
					<span
						class="letter"
						style={`--delay: ${$mq.reducedMotion ? 0 : _.random(0, 1000)}ms`}
						style:transform={id !== "dilla"
							? null
							: !showTitle
							? `rotate(${randomX}deg) translate(${randomY}px, ${randomRotate}px)`
							: "rotate(0) translate(0,0)"}>{letter}</span
					>
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
	h3#swing-title .letter:nth-child(2) {
		transform: translate(0, 0);
		transition: all var(--1s);
		color: white;
	}
	h3#swing-title.visible .letter:nth-child(2) {
		transform: translate(15px, 0px);
		color: var(--accent);
	}
	h3#swing-title .letter:nth-child(3) {
		transform: translate(0, 0);
		transition: all var(--1s) calc(var(--1s) * 0.25);
	}
	h3#swing-title.visible .letter:nth-child(3) {
		transform: translate(15px, 0px);
	}
	h3#swing-title .letter:nth-child(4) {
		transform: translate(0, 0);
		transition: all var(--1s) calc(var(--1s) * 0.5);
		color: white;
	}
	h3#swing-title.visible .letter:nth-child(4) {
		transform: translate(25px, 0px);
		color: var(--accent);
	}
	h3#swing-title .letter:nth-child(5) {
		transform: translate(0, 0);
		transition: all var(--1s) calc(var(--1s) * 0.75);
	}
	h3#swing-title.visible .letter:nth-child(5) {
		transform: translate(25px, 0px);
	}

	/* SHIFT */
	h3#shift-title .letter:nth-child(1) {
		transform: translate(0, 0);
		transition: all var(--1s) calc(var(--1s) * 0.5);
		color: white;
	}
	h3#shift-title.visible .letter:nth-child(1) {
		transform: translate(0, -30px);
		color: var(--accent);
	}

	/* DILLA */
	h3#dilla-title {
		color: white;
	}
	h3#dilla-title.visible .letter {
		color: var(--accent);
		transition: all var(--1s) var(--delay);
	}
</style>
