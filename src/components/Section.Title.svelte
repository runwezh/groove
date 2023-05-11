<script>
	import inView from "$actions/inView.js";

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
	{id}
	class:visible={showTitle}
	use:inView
	on:enter={onEnter}
	on:exit={onExit}
>
	{#if hasAnimation}
		{#each title.split(" ") as word}
			<span class="word">
				{#each word.split("") as letter}
					<span>{letter}</span>
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
	:global(h3#swing span:nth-child(2)) {
		transform: translate(0, 0);
		transition: all 1s;
		color: white;
	}
	:global(h3#swing.visible span:nth-child(2)) {
		transform: translate(0, 15px);
		color: var(--accent);
	}
	:global(h3#swing span:nth-child(4)) {
		transform: translate(0, 0);
		transition: all 1s 500ms;
		color: white;
	}
	:global(h3#swing.visible span:nth-child(4)) {
		transform: translate(0, 15px);
		color: var(--accent);
	}
	:global(h3#shift span:nth-child(1)) {
		transform: translate(0, 0);
		transition: all 1s 500ms;
		color: white;
	}
	:global(h3#shift.visible span:nth-child(1)) {
		transform: translate(0, -30px);
		color: var(--accent);
	}
</style>
