<script>
	export let url;
	export let song;
	export let artist;
</script>

<div class="container">
	<div class="description"><strong>{song}</strong> by {artist}</div>
	<audio src={url} controls={true} />
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 0.5em 0;
	}
	.description {
		margin-right: 1em;
	}
</style>
