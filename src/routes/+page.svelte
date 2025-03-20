<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Index from "$components/Index.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";
	import { base } from '$app/paths';

	export let data;

	version();

	const preloadFont = [
		`${base}/assets/fonts/national/National2Web-Regular.woff2`,
		`${base}/assets/fonts/national/National2Web-Bold.woff2`,
		`${base}/assets/fonts/nicolatte/Nicolatte-Regular.otf`
	];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
	setContext("data", data.data);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<Index />
