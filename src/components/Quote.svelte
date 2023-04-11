<script>
	export let quote;
	export let speaker;
	export let videoUrl;
</script>

<div>
	<p class="quote">{@html quote}</p>
	<p>-{@html speaker}</p>
</div>

<style>
	div {
		margin: 4em 0;
	}
	.quote {
		font-style: italic;
	}
</style>
