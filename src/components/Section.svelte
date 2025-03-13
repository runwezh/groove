<script>
	import Demo from "$components/Demo.svelte";
	import Scroll from "$components/Scroll.svelte";
	import Song from "$components/Song.svelte";
	import Circle from "$components/Circle.svelte";
	import Feeling from "$components/Feeling.svelte";
	import Image from "$components/Image.svelte";
	import Title from "$components/Section.Title.svelte";
	import { started } from "$stores/misc.js";

	export let id;
	export let title;
	export let chunks;
	// 添加isPreview参数
	export let isPreview = false;

	const components = { Scroll, Demo, Song, Circle, Feeling, Image };
</script>

<section {id} class:visible={$started}>
	{#if title}
		<Title {id} {title} />
	{/if}

	{#each chunks as { type, text, list, component, classname, steps, notes, songId, style, url, song, artist, year, dots, division, interactive, prompt, share, src, alt }}
		<svelte:element this={type} class={classname}>
			{#if text}
				{@html text}
			{:else if list}
				{#each list as item}
					<li>{@html item}</li>
				{/each}
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
					{year}
					{dots}
					{division}
					interactive={interactive === "true"}
					{prompt}
					{share}
					{src}
					{alt}
					{isPreview} 
				/>
				<!-- 添加传递isPreview参数 -->
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
	section#straight {
		margin-top: 5em;
	}
	section#swing {
		margin-bottom: 5em;
	}
	section#bonus {
		margin-top: 0;
		margin-bottom: 1em;
	}
	section#dilla {
		margin-bottom: 0;
	}
	section#conclusion {
		margin-top: 5em;
		margin-bottom: 2em;
	}
	section#notes {
		margin-bottom: 5em;
	}
	.note {
		background: var(--color-gray-900);
		border-left: 5px solid white;
		padding: 1em;
	}
	.feeling {
		font-style: italic;
	}
	.quote {
		font-size: var(--28px);
		margin: 2em 0;
	}
	section#straight p:last-child,
	section#notes p:last-child {
		margin-top: 3em;
		margin-bottom: 0;
	}
</style>
