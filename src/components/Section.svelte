<script>
	import Song from "$components/Song.svelte";
	import Scroll from "$components/Scroll.svelte";

	export let id;
	export let title;
	export let chunks;

	const components = { Scroll, Song };
</script>

<section {id}>
	{#if title}<h3>{title}</h3>{/if}

	{#each chunks as { type, text, component, classname, steps, songId }}
		<svelte:element this={type} class={classname}>
			{#if text}
				{@html text}
			{:else}
				<svelte:component this={components[component]} {steps} {songId} />
			{/if}
		</svelte:element>
	{/each}
</section>

<style>
	.inline {
		display: inline-block;
	}
</style>
