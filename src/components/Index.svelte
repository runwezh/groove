<script>
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";

	import copy from "$data/copy.json";

	const { hed, dek } = copy;
</script>

<article>
	<h1>{hed}</h1>
	<h2>{dek}</h2>

	{#each copy.sections as section}
		{#if section.id === "nerd-box"}
			<details class="nerd-box">
				<summary>{section.summary}</summary>
				<Section {...section} />
			</details>
		{:else}
			<Section {...section} />
		{/if}
	{/each}
</article>

<Footer />

<style>
	article {
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		font-family: var(--mono);
	}
	summary {
		font-weight: bold;
	}
	summary:hover {
		cursor: pointer;
	}
	.nerd-box {
		background: var(--color-gray-100);
		padding: 2em;
	}
</style>
