<script>
	import Drops from "$components/Linear.Drops.svelte";

	export let data;
</script>

<svg height={800} width="100%">
	{#each Object.keys(data) as instrument}
		<Drops {instrument} notes={data[instrument]} />
	{/each}
</svg>

<style>
	svg {
		position: absolute;
		top: 0;
		background: #080e1c;
	}
</style>
