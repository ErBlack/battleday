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
	 * @type {({x: number, y: number, href: string}|undefined)[]}
	 */
	let drawCells = [];

	const store = field.store;

	field.store.subscribe((cells) => {
		drawCells = cells.map(({ x, y, shot, around, coordinate }) => {
			const ship = field.shipsMap[coordinate];

			if (ship) {
				if (shot) {
					return {
						x,
						y,
						href: `#crush${(x + y) % 2}`,
						class: ship.destroyed ? 'destroyed' : 'onfire'
					};
				} else {
					if (ship instanceof RealShip) {
						return {
							x,
							y,
							href: `#ship${ship.coordinates.length}-${ship.coordinates.indexOf(coordinate)}`,
							transform: ship.direction === 'h' ? `rotate(-90)` : undefined
						};
					}
				}
			} else if (shot) {
				return { x, y, href: `#dot` };
			} else if (showAround && around) {
				return { x, y, href: `#dot` };
			}
		});
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
			{#if props}
				<use
					{...props}
					width="1"
					height="1"
					style={`transform-origin: ${props.x + 0.5}px ${props.y + 0.5}px`}
				/>
			{/if}
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

	.onfire {
		animation:
			crush 0.25s ease-in,
			burn 3s infinite linear;
	}

	.destroyed {
		animation:
			crush 0.25s ease-in,
			coolDown 3s ease-out;
	}

	@keyframes crush {
		0% {
			transform: scale(0.25);
		}

		50% {
			transform: scale(4);
		}

		100% {
			transform: scale(1);
		}
	}

	@keyframes coolDown {
		from {
			color: var(--color-red);
		}
		to {
			color: var(--color-pen);
		}
	}

	@keyframes burn {
		0% {
			color: var(--color-red);
		}
		25% {
			color: orangered;
			transform: rotate(1deg) skew(0.5deg, 0.5deg) scale(1.01);
		}

		50% {
			color: crimson;
			transform: rotate(-1deg);
			transform: rotate(1deg) skew(0, -0.5deg) scale(1);
		}

		75% {
			color: red;
			transform: rotate(-1deg);
			transform: rotate(1deg) skew(0, 0.5deg) scale(0.99);
		}
		100% {
			color: var(--color-red);
		}
	}
</style>
