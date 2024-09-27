<script>
	import { RealShip } from '../ship/real-ship.js';
	import InteractionPlacementMark from './interaction-placement-mark.svelte';
	import InteractionPlacementMenu from './interaction-placement-menu.svelte';
	import InteractionShootMark from './interaction-shoot-mark.svelte';
	import InteractionShootMenu from './interaction-shoot-menu.svelte';

	export let showAround = false;

	/**
	 * @typedef {import('./field.js').Field<any>} Field
	 * @typedef {import('./field.js').CellDescriptor} CellDescriptor
	 */
	/**
	 * @type {Field}
	 */
	export let field;

	/**
	 * @param {MouseEvent} event
	 */
	const onClick = (event) => {
		if (!event.currentTarget) return;

		const { offsetX, offsetY } = event;
		const { clientWidth, clientHeight } = /** @type {HTMLElement} */ (event.currentTarget);

		const x = Math.floor((offsetX / clientWidth) * 10);
		const y = Math.floor((offsetY / clientHeight) * 10);

		field.handleInteraction(y * 10 + x);
	};

	/**
	 * @type {{x: number, y: number, href: string}[]}
	 */
	let drawCells = [];

	field.store.subscribe((cells) => {
		drawCells = cells.reduce(
			/**
			 * @param {{x: number, y: number, href: string, transform?: string}[]} acc
			 * @param {CellDescriptor} cell
			 */
			(acc, { x, y, shot, around, coordinate }) => {
				const ship = field.shipsMap[coordinate];

				if (ship) {
					if (shot) {
						acc.push({ x, y, href: `#crush${(x + y) % 2}` });
					} else {
						if (ship instanceof RealShip) {
							acc.push({
								x,
								y,
								href: `#ship${ship.coordinates.length}-${ship.coordinates.indexOf(coordinate)}`,
								transform:
									ship.direction === 'h' ? `rotate(-90, ${x + 0.5}, ${y + 0.5})` : undefined
							});
						}
					}
				} else if (shot) {
					acc.push({ x, y, href: `#dot` });
				} else if (showAround && around) {
					acc.push({ x, y, href: `#dot` });
				}

				return acc;
			},
			[]
		);
	});
</script>

<div class="field">
	<svg class="grid" viewBox="0 0 1 1">
		<use href="#field" width="1" height="1" />
	</svg>
	<svg
		class="content"
		viewBox="0 0 10 10"
		on:keypress={() => {}}
		on:click={onClick}
		role="menu"
		tabindex="0"
	>
		<InteractionPlacementMark interaction={field.interaction} />
		<InteractionShootMark interaction={field.interaction} />
		{#each drawCells as props}
			<use {...props} width="1" height="1" />
		{/each}
	</svg>
</div>
<InteractionPlacementMenu
	interaction={field.interaction}
	onItemClick={field.handleInteractionMenu}
/>
<InteractionShootMenu interaction={field.interaction} onItemClick={field.handleInteractionMenu} />

<style>
	.field {
		width: calc(11 * var(--cell-size));
		height: calc(11 * var(--cell-size));
		position: relative;
	}

	.grid {
		width: 100.5%;
		height: 101%;
		position: absolute;
	}

	.content {
		position: absolute;
		left: var(--cell-size);
		top: var(--cell-size);
		width: calc(10 * var(--cell-size));
		height: calc(10 * var(--cell-size));
		outline: none;
		z-index: 1;
	}
</style>
