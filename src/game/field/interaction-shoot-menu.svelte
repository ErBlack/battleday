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
		show = value && value.type === 'shoot';
		placed = value && value.coordinate !== undefined;
	});
</script>

{#if show}
	<menu>
		<Button disabled={!placed} on:click={() => onItemClick('shoot')}>Shoot</Button>
	</menu>
{/if}

<style>
	menu {
		margin: 0 0 0 calc(var(--cell-size) * 4);
		padding: 0;
		display: grid;
		grid-template-columns: calc(var(--cell-size) * 4);
		gap: var(--cell-size);
	}
</style>
