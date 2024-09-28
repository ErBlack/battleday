<script>
	import Button from '../../ui/invitation/button.svelte';

	let show = false;
	let placed = false;

	/**
	 * @type {(type: string) => void}
	 */
	export let onItemClick;

	/**
	 * @typedef {import('./field.js').InteractionStore} InteractionStore
	 */

	/**
	 * @type {InteractionStore}
	 */
	export let interaction;

	interaction.subscribe((value) => {
		show = value && value.type === 'placement';
		placed = value && value.coordinate !== undefined;
	});
</script>

{#if show}
	<menu>
		<Button on:click={() => onItemClick('rotate')}>Rotate</Button>
		<Button disabled={!placed} on:click={() => onItemClick('save')}>Save</Button>
	</menu>
{/if}

<style>
	menu {
		margin: 0 0 0 calc(var(--cell-size) * 2);
		padding: 0;
		display: grid;
		grid-template-columns: calc(var(--cell-size) * 4) calc(var(--cell-size) * 3);
		gap: var(--cell-size);
	}
</style>
