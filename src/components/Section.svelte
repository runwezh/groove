<script>
	import Demo from "$components/Demo.svelte";
	import Scroll from "$components/Scroll.svelte";
	import Song from "$components/Song.svelte";
	import { started } from "$stores/misc.js";
	import Title from "$components/Section.Title.svelte";

	export let id;
	export let title;
	export let chunks;

	const components = { Scroll, Demo, Song };
</script>

<section {id} class:visible={$started}>
	{#if title}
		<Title {id} {title} />
	{/if}

	{#each chunks as { type, text, component, classname, steps, notes, songId, url, song, artist }}
		<svelte:element this={type} class={classname}>
			{#if text}
				{@html text}
			{:else}
				<svelte:component
					this={components[component]}
					{steps}
					{notes}
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
		margin: 10em 0;
	}
	section.visible {
		visibility: visible;
	}
	.inline {
		display: inline-block;
	}
</style>
