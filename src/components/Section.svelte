<script>
	import Demo from "$components/Demo.svelte";
	import Scroll from "$components/Scroll.svelte";
	import Song from "$components/Song.svelte";
	import Circle from "$components/Circle.svelte";
	import { started } from "$stores/misc.js";
	import Title from "$components/Section.Title.svelte";

	export let id;
	export let title;
	export let chunks;

	const components = { Scroll, Demo, Song, Circle };
</script>

<section {id} class:visible={$started}>
	{#if title}
		<Title {id} {title} />
	{/if}

	{#each chunks as { type, text, component, classname, steps, notes, songId, style, url, song, artist, dots, division, interactive }}
		<svelte:element this={type} class={classname}>
			{#if text}
				{@html text}
			{:else}
				<svelte:component
					this={components[component]}
					{steps}
					{notes}
					{songId}
					{style}
					{url}
					{song}
					{artist}
					{dots}
					{division}
					interactive={interactive === "true"}
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
	section#bonus {
		margin-top: 0;
		margin-bottom: 3em;
	}
</style>
