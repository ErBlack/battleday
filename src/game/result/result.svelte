<script>
	import { onDestroy, onMount } from 'svelte';
	import { gameOpen, winner } from '../store.js';
	import Code from './code.svelte';
	import Button from '../../ui/invitation/button.svelte';

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog;

	const onClose = () => {
		dialog.close();
		winner.set(null);
	};

	const onRepeat = () => {
		dialog.close();
		winner.set(null);
		gameOpen.set(true);
	};

	onMount(() => {
		winner.subscribe((value) => {
			if (value !== null) {
				dialog.showModal();
			}
		});
	});
</script>

<dialog bind:this={dialog} on:close={onClose}>
	{#if $winner !== null}
		{#if $winner}
			<h1>You win!</h1>

			<p>It was a tough fight but you managed to do it!</p>
			<Code />
			<p>
				Send code to <a href="https://t.me/erblack">@ErBlack</a>
			</p>
		{:else}
			<h1>You lose!</h1>

			<p>This time the enemy was stronger.</p>

			<p>Better luck next time?</p>
		{/if}

		<menu>
			<Button on:click={onClose} size={1}>Close</Button>
			<Button on:click={onRepeat} size={1}>Repeat</Button>
		</menu>
	{/if}
</dialog>

<style>
	dialog {
		color: inherit;
		width: calc(var(--cell-size) * 8);
		background-image: var(--cells-background);
		background-size: var(--cell-size) var(--cell-size);
		padding: var(--cell-size);
		outline: none;
		border-left: solid 2px var(--color-cells);
		border-bottom: solid 2px var(--color-cells);
		border-top: none;
		border-right: none;
		animation: appear 1s ease-out both;
	}

	h1 {
		line-height: var(--cell-size);
		margin: 0 0 var(--cell-size) 0;
		font-size: calc(var(--cell-size));
		transform: translateY(calc(var(--cell-size) * 0.12));
		font-weight: 450;
	}

	p {
		--letters-size: 0.56;
		font-size: calc(var(--cell-size) * var(--letters-size));
		margin: var(--cell-size) 0;
		line-height: var(--cell-size);
		transform: translateY(calc(var(--cell-size) * 0.25));
		font-weight: 380;
	}

	menu {
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--cell-size);
		grid-template-columns: calc(var(--cell-size) * 2) calc(var(--cell-size) * 3);
	}

	@keyframes appear {
		from {
			transform: perspective(calc(var(--cell-size) * 5)) translate3d(25vw, -25vh, 150px)
				rotate(-65deg);
			box-shadow: 200px 550px 200px 0 rgba(0, 0, 0, 0.5);
		}
		to {
			transform: perspective(calc(var(--cell-size) * 5)) translate3d(0, 0, 8px) rotate(2deg);
			box-shadow: -25px 25px 50px 0 rgba(0, 0, 0, 0.25);
		}
	}
</style>
