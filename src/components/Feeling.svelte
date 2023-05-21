<script>
	export let prompt;
	export let share;
</script>

<div class="wrapper">
	<div class="prompt">{prompt}</div>
	<div class="share">{share}</div>
</div>

<style>
	.wrapper {
		background: var(--color-gray-900);
		border-left: 5px solid var(--yellow);
		padding: 1em;
		margin-top: 2em;
	}
	.prompt {
		font-weight: bold;
		margin-bottom: 0.5em;
	}
	.share {
		font-style: italic;
		color: var(--color-gray-200);
	}
</style>
