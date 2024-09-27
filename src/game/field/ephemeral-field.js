import { EphemeralShip } from '../ship/ephemeral-ship.js';
import { Field } from './field.js';
import { getNextCellIndex } from './getNextCellIndex.js';
import { getPrevCellIndex } from './getPrevCellIndex.js';
import { isFirstCell } from './isFirstCell.js';
import { isLastCell } from './isLastCell.js';

/**
 * @typedef {import('./field.js').FieldStore} FieldStore
 */

/**
 * @extends {Field<EphemeralShip>}
 */
export class EphemeralField extends Field {
	/**
	 * @param {FieldStore} store
	 */
	constructor(store) {
		super(store);
	}

	/**
	 * @param {number} coordinate
	 */
	findConnectedShip(coordinate) {
		if (!isFirstCell('v', coordinate)) {
			const ship = this.shipsMap[getPrevCellIndex('v', coordinate)];

			if (ship) return ship;
		}

		if (!isFirstCell('h', coordinate)) {
			const ship = this.shipsMap[getPrevCellIndex('h', coordinate)];

			if (ship) return ship;
		}

		if (!isLastCell('v', coordinate)) {
			const ship = this.shipsMap[getNextCellIndex('v', coordinate)];

			if (ship) return ship;
		}

		if (!isLastCell('h', coordinate)) {
			const ship = this.shipsMap[getNextCellIndex('h', coordinate)];

			if (ship) return ship;
		}
	}

	/**
	 * @param {number} coordinate
	 * @param {boolean} hit
	 * @param {boolean} destroyed
	 */
	applyShotResult(coordinate, hit, destroyed) {
		this.updateCell(coordinate, { shot: true });

		if (hit) {
			const foundShip = this.findConnectedShip(coordinate);

			if (foundShip) {
				foundShip.addCoordinate(coordinate);

				if (destroyed) {
					foundShip.destroy();
				}

				this.handleShipUpdate(foundShip);
			} else {
				this.addShip(new EphemeralShip(coordinate, destroyed));
			}
		}
	}

	getUnexploredShips() {
		return this.ships.filter((ship) => !ship.destroyed);
	}

	/**
	 * @param {EphemeralShip} ship
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

		return coordinates.sort((a, b) => a - b).map((i) => this.cells[i]);
	};
}
