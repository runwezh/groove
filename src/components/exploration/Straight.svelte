<script>
	import copy from "$data/copy.json";
	import Song from "$components/Song.svelte";

	console.log({ copy });
</script>

{#each copy.straight as { type, text, id }}
	{#if type === "p"}
		<p>{@html text}</p>
	{:else if type === "groove"}
		<!-- <Song/> -->
	{/if}
{/each}
