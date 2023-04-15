<script>
	import { getContext } from "svelte";

	const instrument = "hihat";

	const { beatsPerMeasure, getIsPlaying, getData, getT } = getContext("song");
	const isPlaying = getIsPlaying();
	const data = getData();
	const t = getT();

	const onKeyDown = (e) => {
		if ($isPlaying && e.keyCode === 32) {
			$data[instrument] = [...$data[instrument], +($t % beatsPerMeasure)];
			// TODO: not visible right now because different measures. have to figure out how to reset
		}
	};
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />
