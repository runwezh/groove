<script>
	import { DollarSign } from "lucide-svelte";
	export let text = "Tip";
	export let href;
</script>

<a class="tip-button" {href} target="_blank" rel="noreferrer" role="button">
	<span class="text">{text}</span>
	<span class="icon"><DollarSign color="currentColor" /></span>
</a>

<style>
	a.tip-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 0.05em;
		padding: 12px 16px;

		background: var(--color-gray-900);
		color: white;
		border: 3px solid white;
		box-shadow: 1px 1px 0px 0px white, 2px 2px 0px 0px white,
			3px 3px 0px 0px white, 4px 4px 0px 0px white, 5px 5px 0px 0px white;
		position: relative;
		border-radius: 0px;
		text-transform: uppercase;
		font-family: var(--mono);
	}
	a.tip-button:active {
		box-shadow: 0px 0px 0px 0px;
		transform: translate(5px, 5px);
		animation: none;
	}
	a.tip-button:hover {
		background: var(--color-gray-700);
	}

	.text {
		transform: translate(0, 2px);
	}

	.icon {
		display: inline-block;
		border: 1px solid currentColor;
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		text-align: center;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
		padding: 2px;
	}
</style>
