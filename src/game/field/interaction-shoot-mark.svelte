<script>
	import { getCellCoordinates } from './getCellCoordinates.js';

	/**
	 * @typedef {import('./field.js').InteractionStore} InteractionStore
	 */

	/**
	 * @type {InteractionStore}
	 */
	export let interaction;

	/**
	 * @type {number | undefined}
	 */
	let x;
	/**
	 * @type {number | undefined}
	 */
	let y;

	interaction.subscribe((value) => {
		if (value && value.type === 'shoot' && value.coordinate !== undefined) {
			const coordinate = getCellCoordinates(value.coordinate);
			x = coordinate.x;
			y = coordinate.y;
		} else {
			x = undefined;
			y = undefined;
		}
	});
</script>

{#if x !== undefined && y !== undefined}
	<use href="#target" width="1" height="1" {x} {y} />
{/if}

<style>
	use {
		color: var(--color-red);
	}
</style>
