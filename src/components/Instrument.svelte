<script>
	import Note from "$components/Note.svelte";

	export let id;
	export let i;
	export let data;

	const colors = {
		hihat: "lightblue",
		kick: "darkblue",
		snare: "cornflowerblue"
	};
</script>

{#each data as note}
	<Note {note} color={colors[id]} {id} innerRadius={150 + i * 22} />
{/each}
