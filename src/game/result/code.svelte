<script>
	import Button from '../../ui/invitation/button.svelte';
	import { winCode } from '../store.js';

	let copied = false;

	/**
	 * @param {Event} event
	 */
	const copyCode = ({ target }) => {
		try {
			// @ts-ignore
			navigator.clipboard.writeText(target.innerText);
			if (copied) return;

			copied = true;

			setTimeout(() => {
				copied = false;
			}, 1000);
		} catch (error) {
			copied = false;
		}
	};
</script>

{#if $winCode}
	<div class="code">
		<Button size={1} on:click={copyCode}>{$winCode}</Button>
		<span
			>{#if copied}Copied!{:else}Click to copy{/if}</span
		>
	</div>
{/if}

<style>
	.code {
		display: grid;
		grid-template-columns: calc(var(--cell-size) * 5) var(--cell-size);
	}

	span {
		font-size: 18px;
		line-height: 0.8;
		padding-left: 3px;
		font-variation-settings:
			'BNCE' 0,
			'INFM' 0,
			'SPAC' 0;
		transition:
			font-variation-settings 0.1s ease-in,
			transform 0.1s ease-in;
		align-self: center;
	}

	.code:active span {
		font-variation-settings:
			'BNCE' 100,
			'INFM' 100,
			'SPAC' 0;
		transition:
			font-variation-settings 0.1s ease-in,
			transform 0.1s ease-in;
		transform: translate(3px, 2px);
	}
</style>
