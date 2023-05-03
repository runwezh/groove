<script>
	import { getContext } from "svelte";

	const instrument = "hihat";

	const { beatsPerMeasure, getIsPlaying, getData, getCurrentBeat } =
		getContext("song");
	const isPlaying = getIsPlaying();
	const data = getData();
	const beat = getCurrentBeat();

	const onKeyDown = (e) => {
		if ($isPlaying && e.keyCode === 32) {
			// TODO: use previous beat here to decrease latency
			$data[instrument] = [...$data[instrument], +($beat % beatsPerMeasure)];
		}
	};
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />
