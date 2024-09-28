import { randomArrayElement } from '$lib/randomArrayElement.js';
import { random } from '../../lib/random.js';

import { getNextCellIndex } from '../field/getNextCellIndex.js';
import { getPrevCellIndex } from '../field/getPrevCellIndex.js';
import { invertAxis } from '../field/invertAxis.js';
import { isFirstCell } from '../field/isFirstCell.js';
import { isLastCell } from '../field/isLastCell.js';
import { RealShip } from '../ship/real-ship.js';
import { ships } from './ships.js';
import { User } from './user.js';

/**
 * @typedef {import('../ship/ephemeral-ship.js').EphemeralShip} EphemeralShip
 * @typedef {import('../ship/ship.js').Ship} Ship
 * @typedef {import('../field/real-field.js').RealField} RealField
 * @typedef {import('../field/ephemeral-field.js').EphemeralField} EphemeralField
 * @typedef {import('../field/getDefaultFieldStore.js').CellDescriptor} CellDescriptor
 */

export class Bot extends User {
	constructor() {
		super();
	}

	async getShotTarget() {
		const unexploredShips = this.enemyField.getUnexploredShips();

		/**
		 * @type {CellDescriptor[]}
		 */
		let targetCells;

		if (unexploredShips.length) {
			const ship = randomArrayElement(unexploredShips);

			targetCells = this.enemyField.getShipDiscoveryCells(ship);
		} else {
			targetCells = this.enemyField.cells;
		}

		const cell = randomArrayElement(
			targetCells.filter((cell) => !cell.shot && !cell.ship && !cell.around)
		);

		const coordinate = cell.coordinate;

		this.enemyField.updateCell(coordinate, { shot: true });

		return coordinate;
	}

	/**
	 * @param {Ship} ship
	 * @returns
	 */
	getShipDiscoveryCells = (ship) => {
		/**
		 * @type {number[]}
		 */
		const coordinates = [];
		const c1 = ship.coordinates[0];
		const c2 = ship.coordinates[ship.coordinates.length - 1];

		if (ship.direction === 'v' || !ship.direction) {
			if (!isFirstCell('v', c1)) {
				coordinates.push(getPrevCellIndex('v', c1));
			}

			if (!isLastCell('v', c2)) {
				coordinates.push(getNextCellIndex('v', c2));
			}
		}

		if (ship.direction === 'h' || !ship.direction) {
			if (!isFirstCell('h', c1)) {
				coordinates.push(getPrevCellIndex('h', c1));
			}

			if (!isLastCell('h', c2)) {
				coordinates.push(getNextCellIndex('h', c2));
			}
		}

		return coordinates.sort((a, b) => a - b).map((i) => this.enemyField.cells[i]);
	};

	async placeShips() {
		ships.forEach((size) => {
			this.#placeShipRandomly(size);
		});
	}

	/**
	 *
	 * @param {1|2|3|4} size
	 */
	#placeShipRandomly = (size) => {
		/**
		 * @type {'v' | 'h'}
		 */
		let direction = Math.random() > 0.5 ? 'v' : 'h';

		let availableShipLocations = this.personalField.getAvailableShipLocations(direction, size);

		/* Changing ship direction if no room for ship in generated current direction */
		if (availableShipLocations.length === 0) {
			direction = invertAxis[direction];
			availableShipLocations = this.personalField.getAvailableShipLocations(direction, size);
		}

		if (availableShipLocations.length === 0) {
			throw new Error('No available ship locations');
		}

		const start = availableShipLocations[random(0, availableShipLocations.length)];

		const ship = new RealShip(size, direction, start);

		this.personalField.addShip(ship);

		return ship;
	};
}
