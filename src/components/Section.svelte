<script>
	import Quote from "$components/Quote.svelte";
	import Grid from "$components/Grid.svelte";
	import Play from "$components/Play.svelte";
	import Circle from "$components/Circle.svelte";

	export let id;
	export let title;
	export let chunks;

	const components = { Play, Grid, Quote, Circle };
</script>

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
