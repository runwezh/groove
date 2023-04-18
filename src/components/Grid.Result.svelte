<script>
	import Instrument from "$components/Grid.Instrument.svelte";
	import quantize from "$utils/quantize.js";
	import Toggle from "$components/helpers/Toggle.svelte";

	export let data;
	export let barHeight;

	$: console.log({ data, quantizedData });

	let quantization = "off";

	$: quantizedData = quantize(data);
	$: display = quantization === "off" ? data : quantizedData;
</script>

<div class="result" class:visible={data.length > 0}>
	<div class="container">
		<Instrument data={display} id={"result"} height={barHeight} />
	</div>
	<Toggle label="quantize" style="inner" bind:value={quantization} />
</div>

<style>
	.result {
		display: none;
	}
	.container {
		width: 100%;
		position: relative;
	}
	.visible {
		display: block;
	}
</style>
