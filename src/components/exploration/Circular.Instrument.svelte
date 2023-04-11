<script>
	import { getContext } from "svelte";
	import Note from "$components/Circular.Note.svelte";

	export let id;
	export let i;
	export let data;

	const { getAngleScale, getInstrumentToggles } = getContext("song");
	const angleScale = getAngleScale();
	const instrumentToggles = getInstrumentToggles();
	const x = (theta) => innerRadius * Math.cos(theta);
	const y = (theta) => innerRadius * Math.sin(theta);

	$: innerRadius = 150 + i * 22;
	$: points = data.map((note) => {
		const theta = angleScale(note);
		return `${x(theta)},${y(theta)}`;
	});
	$: pointsString = points.join(" ");
	$: isOn = $instrumentToggles[id] === "on";

	const colors = {
		hihat: "lightblue",
		kick: "black",
		snare: "lightgreen"
	};
</script>

{#each data as note}
	<Note {note} color={colors[id]} {id} {innerRadius} />
{/each}
<polygon
	class:muted={!isOn}
	points={pointsString}
	fill={colors[id]}
	stroke="black"
/>

<style>
	polygon {
		transform: translate(50%, 50%);
		opacity: 0.2;
	}
	.muted {
		opacity: 0.01;
	}
</style>
