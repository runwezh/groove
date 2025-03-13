<script>
	import { onMount } from "svelte";
	import Landing from "$components/Landing.svelte";
	import IntroAnimation from "$components/IntroAnimation.svelte";
	import Footer from "$components/Footer.svelte";
	import Section from "$components/Section.svelte";
	import { started, soundOn, userMuted, ios } from "$stores/misc.js";
	import defaultCopy from "$data/copy.json";
	
	// 添加预览模式标志
	export let isPreview = false;
	export let data = null;
	
	// 使用传入的数据或默认数据
	$: copy = data || defaultCopy;
	$: sections = copy.sections || [];

	onMount(() => {
		$ios = !!navigator.userAgent.match(/iPhone|iPad|iPod/i);

		document.addEventListener("visibilitychange", (event) => {
			if (document.visibilityState == "visible") {
				if (!$userMuted) $soundOn = true;
			} else {
				$soundOn = false;
			}
		});
		
		// 在预览模式下自动设置为已开始状态
		if (isPreview) {
			$started = true;
		}
	});
	
	// 在预览模式下禁用音频和某些交互
	$: if (isPreview) {
		$soundOn = false;
	}
</script>

<article class:started={$started} class:preview={isPreview}>
	{#if !isPreview}
		<IntroAnimation />
	{/if}
	<Landing />

	<div class="sections" class:started={$started}>
		{#each sections as { id, title, chunks }}
			{#if id === "bonus"}
				<details>
					<summary>{title}</summary>
					<Section {id} {chunks} {isPreview} />
				</details>
			{:else if id === "notes"}
				{#if !isPreview}
					<iframe
						style="border-radius:12px"
						src="https://open.spotify.com/embed/playlist/2lv10HmmIbXoknNEoNDt2s?utm_source=generator&theme=0"
						width="100%"
						height="352"
						frameBorder="0"
						allowfullscreen=""
						allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
						loading="lazy"
						title="playlist of songs with wonky grooves"
					/>
				{:else}
					<div class="preview-placeholder">
						<p>Spotify 播放列表预览</p>
					</div>
				{/if}
				<Section {id} {title} {chunks} {isPreview} />
			{:else}
				<Section {id} {title} {chunks} {isPreview} />
			{/if}
		{/each}
	</div>
</article>

<Footer />

<style>
	article {
		height: calc(100vh - 78.92px);
		overflow: hidden;
		max-width: 800px;
		margin: auto;
		padding: 0 16px;
		font-size: var(--18px);
	}
	article.started {
		height: auto;
		overflow: visible;
	}
	article.preview {
		height: auto;
		overflow: visible;
		padding-top: 20px;
	}
	.sections {
		visibility: hidden;
	}
	.sections.started {
		visibility: visible;
	}
	details {
		background: var(--color-gray-800);
		border: 3px solid var(--accent);
		padding: 2em;
	}
	summary {
		font-weight: bold;
	}
	summary:hover {
		cursor: pointer;
	}
	summary::marker {
		color: var(--accent);
	}
	.preview-placeholder {
		background-color: #f0f0f0;
		border: 1px dashed #ccc;
		border-radius: 12px;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 20px 0;
	}
	.preview-placeholder p {
		color: #999;
		font-style: italic;
	}
</style>
