export class Ship {
	/**
	 * @type {number[]}
	 */
	coordinates;
	/**
	 * @type {number[]}
	 */
	aroundCoordinates;
	/**
	 * @type {boolean}
	 */
	get destroyed() {
		return false;
	}
	/**
	 * @type {'v' | 'h' | undefined}
	 */
	direction;
	/**
	 * @param {number[]} coordinates
	 * @param {number[]} aroundCoordinates
	 */
	constructor(coordinates, aroundCoordinates) {
		this.coordinates = coordinates;
		this.aroundCoordinates = aroundCoordinates;
	}
}
