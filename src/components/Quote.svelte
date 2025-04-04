<script>
	import _ from "lodash";
	import { scrollyStep, soundOn, ios } from "$stores/misc.js";
	import { base } from '$app/paths';
	
	export let text;
	export let quoted;
	export let id;
	export let step;
	export let source;

	let audioEl;
	let seek = 0;
	let duration;
	let paused;
	let ended;

	$: {
		if (audioEl) {
			if (step === $scrollyStep && !ended) start();
			else if (step !== $scrollyStep) restart();
		}
	}
	const start = () => {
		audioEl.play();
	};
	const restart = () => {
		ended = false;
		paused = true;
		audioEl.pause();
		seek = 0;
	};

	const srcs = {
		"life-changing": "leaving_the_club_edited",
		"undo-education": "no_fucks_edited",
		"future-arrived": null,
		"machine-breathe": null
	};
	const emphases = {
		"life-changing": _.range(15, 19),
		"undo-education": _.range(14, 17),
		"future-arrived": [],
		"machine-breathe": [],
		"tradition-evolving": []
	};

	// 简化的分词方法 - 只处理标点符号和空格
    let words;
    if (text && text.match(/[\u4e00-\u9fa5]/g)) {
        // 1. 处理标点符号 - 把每个标点符号变成独立词
        const punctRegex = /([""''「」『』，。、；：？！…—·\s])/g;
        const textWithSpaces = text.replace(punctRegex, " $1 ");
        
        // 2. 按空格分割
        words = textWithSpaces.split(/\s+/).filter(Boolean);
        
        // 3. 移除空白元素
        words = words.filter(w => w.trim() !== "");
    } else if (text) {
        // 非中文文本按空格分词
        words = text.split(/\s+/).filter(Boolean);
    } else {
        words = [];
    }
    
    console.log("简化分词结果：", words);

	const data = {
		"life-changing": [
			0.05, 0.2, 0.3, 0.4, 0.55, 1, 1.3, 1.5, 1.8, 2.5, 3, 3.3, 3.5, 4, 4.1,
			4.2, 4.3, 4.6, 5.8, 6.5, 6.7, 6.9, 7.1, 7.3, 7.5, 7.9, 8.1, 8.5, 8.7, 8.9,
			9.1, 9.3, 9.5, 9.7, 9.9, 10.1, 10.3, 11.4, 11.9, 12.1, 12.9, 13.5, 13.7,
			13.9, 14.3, 14.6, 14.8, 15, 15.1, 15.3
		],
		"undo-education": [
			0.05, 0.2, 0.5, 1.2, 1.5, 3.3, 3.5, 3.7, 4, 4.5, 5.3, 5.5, 5.7, 5.9, 6.1,
			6.3, 6.7, 7.1, 8.2, 9, 9.3, 9.8, 10.3, 11.3, 11.5, 11.9, 12.2, 12.5, 19,
			19.3, 19.5, 19.6, 19.8, 20.2, 20.5, 20.7, 21.3, 21.5, 21.9, 22.1, 22.3,
			22.5, 22.7, 22.9, 23.2
		],
		"future-arrived": [],
		"machine-breathe": []
	};

	// 检查和记录可能的问题
    if (!data[id]) {
        console.warn(`ID "${id}" 缺少时间数据配置`);
    }
    if (!emphases[id]) {
        console.warn(`ID "${id}" 缺少强调配置`);
    }

	// 防御式检查 - 确保数据存在
	const timing = id && data[id] ? data[id] : [];
	
	// 防御式循环，避免未定义的数据访问
	let wordTiming = [];
	if (words && words.length > 0) {
		wordTiming = words.map((word, i) => {
			// 确保不超出 timing 数组边界
			const start = i < timing.length ? timing[i] : 0;
			const end = i + 1 < timing.length ? timing[i + 1] : start + 0.3;
			return { word, start, end };
		});
	}
	
	// 或者在使用 data[id] 的地方添加检查
	const currentData = id && data[id] ? data[id] : [];
	
	// 创建安全的强调检查函数
    const safeEmphasis = (idx) => emphases[id] ? emphases[id].includes(idx) : false;
</script>

<!-- 在模板中也添加防御式检查 -->
{#if words && words.length > 0}
	<p class="quote">
		{#each wordTiming as { word, start, end }, i}
			{@const dark = seek >= currentData[i] || $ios}
			{@const emphasis = safeEmphasis(i)}
			<span class:dark class:emphasis>{word} </span>
		{/each}
	</p>
{/if}
<p class="speaker">- {quoted}</p>
<p class="source">{@html source}</p>

{#if !$ios && srcs[id]}
	<audio
		bind:this={audioEl}
		src={`${base}/assets/sound/intro/${srcs[id]}.mp3`}
		bind:currentTime={seek}
		bind:duration
		bind:paused
		bind:ended
		muted={!$soundOn}
	/>
{/if}

<style>
	.quote {
		font-size: 1.8em;
		text-align: start;
	}
	.quote span {
		transition: opacity calc(var(--1s) * 0.3);
		opacity: 0.2;
	}
	.quote span.dark {
		opacity: 1;
	}
	.emphasis {
		font-weight: bold;
	}
	.speaker {
		font-size: 1.2em;
		color: var(--accent);
		text-align: start;
	}
	.source {
		font-size: var(--14px);
		color: var(--color-gray-300);
	}
	:global(.source a) {
		color: var(--color-gray-400);
	}

	@media (max-width: 600px) {
		.quote {
			font-size: 1.3em;
		}
	}
</style>
