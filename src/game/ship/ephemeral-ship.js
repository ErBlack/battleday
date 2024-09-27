import { getAroundCoordinates } from './getAroundCoordinates.js';
import { Ship } from './ship.js';

export class EphemeralShip extends Ship {
	/**
	 * @type {'v' | 'h' | undefined}
	 */
	direction = undefined;

	get destroyed() {
		return this.#destroyed;
	}

	/**
	 * @type {boolean}
	 */
	#destroyed = false;

	/**
	 * @param {number} coordinate
	 */
	constructor(coordinate, destroyed = false) {
		super([coordinate], []);

		if (destroyed) {
			this.destroy();
		}
	}

	/**
	 * @param {number} coordinate
	 */
	addCoordinate(coordinate) {
		if (!this.direction) {
			this.direction = Math.abs(this.coordinates[0] - coordinate) === 1 ? 'h' : 'v';
		}

		this.coordinates.push(coordinate);
		this.coordinates.sort((a, b) => a - b);
	}

	destroy() {
		this.#destroyed = true;
		this.size = this.coordinates.length;
		this.aroundCoordinates = getAroundCoordinates(this.direction || 'v', this.coordinates);
	}
}
