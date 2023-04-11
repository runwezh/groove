<script>
	import Footer from "$components/Footer.svelte";
	import Quote from "$components/Quote.svelte";
	import Grid from "$components/Grid.svelte";
	import NerdBox from "$components/NerdBox.svelte";
	import Play from "$components/Play.svelte";
	import copy from "$data/copy.json";

	const { hed, dek } = copy;
	const components = { Play, Grid, Quote, NerdBox };
</script>

<article>
	<h1>{hed}</h1>
	<h2>{dek}</h2>

	{#each copy.sections as { id, title, chunks }}
		<section {id}>
			{#if title}<h3>{title}</h3>{/if}

			{#each chunks as { type, text, component, classname, props }}
				<svelte:element this={type} class={classname}>
					{#if text}
						{@html text}
					{:else}
						<svelte:component this={components[component]} {...props} />
					{/if}
				</svelte:element>
			{/each}
		</section>
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
</style>
