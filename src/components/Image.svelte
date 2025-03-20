<script>
	import { base } from '$app/paths';
	export let src;
	export let alt;
</script>

<img src={`${base}/assets/img/${src}`} {alt} />

<style>
	img {
		width: 85%;
		margin: auto;
	}
	@media (max-width: 600px) {
		img {
			width: 100%;
		}
	}
</style>
