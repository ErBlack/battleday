import { getNextCellIndex } from '../field/getNextCellIndex.js';
import { getAroundCoordinates } from './getAroundCoordinates.js';
import { Ship } from './ship.js';

export class RealShip extends Ship {
	/**
	 * @type {'v' | 'h'}
	 */
	direction;
	/**
	 * @type {boolean[]}
	 */
	#hullDestroyed;

	/**
	 *
	 * @param {1|2|3|4} size
	 * @param {'v' | 'h'} direction
	 * @param {number} start
	 */
	constructor(size, direction, start) {
		const coordinates = [];
		let index = start;

		for (let i = 0; i < size; i++) {
			coordinates.push(index);
			index = getNextCellIndex(direction, index);
		}

		const aroundCoordinates = getAroundCoordinates(direction, coordinates);

		super(coordinates, aroundCoordinates);

		this.direction = direction;

		this.#hullDestroyed = new Array(size).fill(false);
	}

	/**
	 * @param {number} coordinate
	 */
	takeDamage(coordinate) {
		this.#hullDestroyed[this.coordinates.indexOf(coordinate)] = true;
	}

	get destroyed() {
		return this.#hullDestroyed.every((destroyed) => destroyed);
	}
}
