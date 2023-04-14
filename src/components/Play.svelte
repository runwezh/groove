<script>
	import { getContext } from "svelte";

	const instrument = "hihat";

	const { getIsPlaying, getData, getT } = getContext("song");
	const isPlaying = getIsPlaying();
	const data = getData();
	const t = getT();

	const onKeyDown = (e) => {
		if ($isPlaying && e.keyCode === 32) {
			$data[instrument] = [...$data[instrument], +$t];
		}
	};
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />
