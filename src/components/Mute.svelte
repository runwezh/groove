<script>
	import Icon from "$components/helpers/Icon.svelte";
	import { soundOn } from "$stores/misc.js";

	export let label;
</script>

<div class="wrapper">
	<button
		on:click={() => ($soundOn = !$soundOn)}
		class:faded={!$soundOn}
		aria-label={$soundOn ? "mute" : "unmute"}
	>
		{#if $soundOn}
			<Icon name="volume-2" />
		{:else}
			<Icon name="volume-x" />
		{/if}
	</button>
	<div
		class="label"
		class:visible={!$soundOn}
		class:left={label === "left"}
		class:bottom={label === "bottom"}
	>
		{"(sound is recommended!)"}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	button {
		padding: 0.4em 0.4em 0.1em 0.4em;
		font-size: var(--28px);
		height: 2em;
		width: 2em;
	}
	button.faded {
		opacity: 0.5;
	}
	.label {
		font-size: var(--14px);
		margin-top: 8px;
		position: absolute;
		left: 0;
		color: var(--accent);
		opacity: 0;
	}
	.left {
		transform: translate(calc(-100% - 8px), 0);
		text-align: right;
	}
	.bottom {
		transform: translate(0, calc(100% + 12px));
		bottom: 0;
		text-align: left;
	}
	.label.visible {
		opacity: 1;
	}
</style>
