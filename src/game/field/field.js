import { writable } from 'svelte/store';
import { getNextCellIndex } from './getNextCellIndex.js';
import { invertAxis } from './invertAxis.js';

/**
 * @typedef {Object} PlacementInteraction
 * @property {'placement'} type
 * @property {'v' | 'h'} direction
 * @property {1|2|3|4} size
 * @property {number} coordinate
 */

/**
 * @typedef {Object} ShootInteraction
 * @property {'shoot'} type
 * @property {number | undefined} coordinate
 */

/**
 * @typedef {import('../ship/ship.js').Ship} Ship
 * @typedef {import('../ship/real-ship.js').RealShip} RealShip
 * @typedef {import('./getDefaultFieldStore.js').CellDescriptor} CellDescriptor
 * @typedef {import('svelte/store').Writable<CellDescriptor[]>} FieldStore
 * @typedef {import('svelte/store').Writable<PlacementInteraction | ShootInteraction | false>} InteractionStore
 */

/**
 * @template {Ship} T
 */
export class Field {
	/**
	 * @type {T[]}
	 */
	ships = [];

	/**
	 * @type {Record<number, T>}
	 */
	shipsMap = {};

	/**
	 * @type {(undefined | ((coordinate: number) => void))}
	 */
	interactionCallback;
	/**
	 * @type {(undefined | ((type: string) => void))}
	 */
	interactionMenuCallback;

	/**
	 * @type {InteractionStore}
	 */
	interaction;

	/**
	 * @param {FieldStore} store
	 */
	constructor(store) {
		this.store = store;
		this.interaction = writable(false);

		this.store.subscribe((cells) => {
			this.cells = cells;
		});
	}

	/**
	 * @param {'v' | 'h'} direction
	 * @param {1|2|3|4} size
	 * @returns
	 */
	getAvailableShipLocations(direction, size) {
		/**
		 * @type {number[]}
		 */
		const locations = [];

		for (let i = 0; i < this.cells.length; i++) {
			if (direction === 'h') {
				if ((i % 10) + size > 10) {
					continue;
				}
			}

			if (direction === 'v') {
				if ((Math.floor(i / 10) % 10) + size > 10) {
					continue;
				}
			}

			let index = i;
			let isFree = true;

			for (let coordinateIndex = 0; coordinateIndex < size; coordinateIndex++) {
				const cell = this.cells[index];

				if (cell.ship || cell.around) {
					isFree = false;
					break;
				}

				index = getNextCellIndex(direction, index);
			}

			if (isFree) locations.push(i);
		}

		return locations;
	}

	getAvailableShootLocations() {
		return this.cells
			.filter((cell) => !cell.shot && !cell.ship && !cell.around)
			.map((cell) => cell.coordinate);
	}

	/**
	 * @param {T} ship
	 */
	addShip(ship) {
		this.ships.push(ship);

		ship.coordinates.forEach((coordinate) => {
			this.shipsMap[coordinate] = ship;
		});

		this.store.update((cells) => {
			const newCells = [...cells];

			ship.coordinates.forEach((coordinate) => {
				newCells[coordinate] = { ...newCells[coordinate], ship: true };
			});

			ship.aroundCoordinates.forEach((coordinate) => {
				newCells[coordinate] = { ...newCells[coordinate], around: true };
			});

			return newCells;
		});
	}

	/**
	 * @param {T} ship
	 */
	handleShipUpdate(ship) {
		ship.coordinates.forEach((coordinate) => {
			this.shipsMap[coordinate] = ship;
		});

		this.store.update((cells) => {
			const newCells = [...cells];

			ship.coordinates.forEach((coordinate) => {
				newCells[coordinate] = { ...newCells[coordinate], ship: true };
			});

			ship.aroundCoordinates.forEach((coordinate) => {
				newCells[coordinate] = { ...newCells[coordinate], around: true };
			});

			return newCells;
		});
	}

	/**
	 * @param {number} coordinate
	 * @param {*} props
	 */
	updateCell(coordinate, props) {
		this.store.update((cells) => {
			const newCells = [...cells];
			newCells[coordinate] = { ...newCells[coordinate], ...props };
			return newCells;
		});
	}

	/**
	 * @param {number} coordinate
	 */
	handleInteraction = (coordinate) => {
		if (this.interactionCallback) {
			this.interactionCallback(coordinate);
		}
	};

	/**
	 * @param {string} type
	 */
	handleInteractionMenu = (type) => {
		if (this.interactionMenuCallback) {
			this.interactionMenuCallback(type);
		}
	};

	/**
	 * @param {1|2|3|4} size
	 */
	requestShipPlacement(size) {
		/**
		 * @type {'v' | 'h'}
		 */
		let direction = 'h';
		let availableShipLocations = this.getAvailableShipLocations(direction, size);
		/**
		 * @type {number}
		 */
		let coordinate = availableShipLocations[0];

		const updateInteraction = () => {
			this.interaction.set({
				type: 'placement',
				direction,
				size,
				coordinate
			});
		};

		updateInteraction();

		return new Promise((resolve) => {
			this.interactionCallback = (newCoordinate) => {
				if (availableShipLocations.includes(newCoordinate)) {
					coordinate = newCoordinate;

					updateInteraction();
				}
			};

			this.interactionMenuCallback = (type) => {
				switch (type) {
					case 'rotate':
						direction = invertAxis[direction];
						availableShipLocations = this.getAvailableShipLocations(direction, size);

						if (coordinate !== undefined && !availableShipLocations.includes(coordinate)) {
							coordinate = availableShipLocations[0];
						}

						updateInteraction();
						break;
					case 'save':
						this.interaction.set(false);
						this.interactionCallback = undefined;
						this.interactionMenuCallback = undefined;

						resolve({
							direction,
							size,
							start: coordinate
						});

						break;
				}
			};
		});
	}

	requestShootTarget() {
		let availableShootLocations = this.getAvailableShootLocations();
		/**
		 * @type {number | undefined}
		 */
		let coordinate;

		const updateInteraction = () => {
			this.interaction.set({
				type: 'shoot',
				coordinate
			});
		};

		updateInteraction();

		return new Promise((resolve) => {
			this.interactionCallback = (newCoordinate) => {
				if (availableShootLocations.includes(newCoordinate)) {
					coordinate = newCoordinate;

					updateInteraction();
				}
			};

			this.interactionMenuCallback = (type) => {
				switch (type) {
					case 'shoot':
						this.interaction.set(false);
						this.interactionCallback = undefined;
						this.interactionMenuCallback = undefined;

						resolve(coordinate);
						break;
				}
			};
		});
	}

	print() {
		let result = '    0 1 2 3 4 5 6 7 8 9\n  ┌─────────────────────┐';

		for (let i = 0; i < this.cells.length; i++) {
			if (i % 10 === 0) {
				result += `${i === 0 ? '' : ' │'}\n${i / 10} │`;
			}

			const cell = this.cells[i];

			if (cell.ship) {
				result += cell.shot ? ' ◾' : ' ▢';
			} else if (cell.shot) {
				result += ' ×';
			} else if (cell.around) {
				result += ' ·';
			} else {
				result += ' ~';
			}
		}

		return result + ' │\n  └─────────────────────┘';
	}
}
