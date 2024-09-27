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
	/**
	 * @type {1|2|3|4 | undefined}
	 */
	let size;
	/**
	 * @type {'h'|'v' | undefined}
	 */
	let direction;

	interaction.subscribe((value) => {
		if (value && value.type === 'placement' && value.coordinate !== undefined) {
			const coordinate = getCellCoordinates(value.coordinate);
			x = coordinate.x;
			y = coordinate.y;
			size = value.size;
			direction = value.direction;
		} else {
			x = undefined;
			y = undefined;
			size = undefined;
			direction = undefined;
		}
	});
</script>

{#if size && x !== undefined && y !== undefined && direction}
	<use
		href={size === 1 ? '#ship1-0' : `#ship${size}`}
		width="1"
		height={size}
		{x}
		{y}
		transform={direction === 'h' ? `rotate(-90, ${x + 0.5}, ${y + 0.5})` : undefined}
	/>
{/if}

<style>
	use {
		color: var(--color-link);
	}
</style>
