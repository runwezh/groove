<script>
	import Demo from "$components/Demo.svelte";
	import Scroll from "$components/Scroll.svelte";
	import Song from "$components/Song.svelte";
	import { started } from "$stores/misc.js";

	export let id;
	export let title;
	export let chunks;

	const components = { Scroll, Demo, Song };
</script>

<section {id} class:visible={$started}>
	{#if title}<h3>{title}</h3>{/if}

	{#each chunks as { type, text, component, classname, steps, songId, url, song, artist }}
		<svelte:element this={type} class={classname}>
			{#if text}
				{@html text}
			{:else}
				<svelte:component
					this={components[component]}
					{steps}
					{songId}
					{url}
					{song}
					{artist}
				/>
			{/if}
		</svelte:element>
	{/each}
</section>

<style>
	section {
		visibility: hidden;
	}
	section.visible {
		visibility: visible;
	}
	.inline {
		display: inline-block;
	}
</style>
