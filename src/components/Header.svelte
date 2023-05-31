<script>
	import Tip from "$components/helpers/Tip.svelte";
	import wordmark from "$svg/wordmark.svg";
	import viewport from "$stores/viewport.js";

	$: mobile = $viewport && $viewport.width < 600;
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>

	{#if !mobile}
		<div class="tip">
			<Tip href={"https://donate.stripe.com/00g03oaJRggE3zqeUW"} />
		</div>
	{/if}
</header>

<style>
	header {
		position: relative;
	}

	.wordmark {
		max-width: 10em;
		margin: 0 auto;
		padding: 1em 0;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.tip {
		position: absolute;
		top: 1em;
		right: 1em;
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(.wordmark svg path) {
		fill: currentColor;
	}
</style>
