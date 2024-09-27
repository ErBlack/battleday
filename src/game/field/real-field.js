import { Field } from './field.js';

/**
 * @typedef {import('../ship/real-ship.js').RealShip} RealShip
 * @typedef {import('./field.js').FieldStore} FieldStore
 */

/**
 * @extends {Field<RealShip>}
 */
export class RealField extends Field {
	/**
	 * @param {FieldStore} store
	 */
	constructor(store) {
		super(store);
	}

	/**
	 * @param {number} coordinate
	 * @returns {{
	 *    hit: boolean;
	 *   destroyed: boolean;
	 * }}
	 */
	applyEnemyShot(coordinate) {
		this.updateCell(coordinate, { shot: true });

		const ship = this.shipsMap[coordinate];

		if (ship) {
			ship.takeDamage(coordinate);

			return {
				hit: true,
				destroyed: ship.destroyed
			};
		}

		return {
			hit: false,
			destroyed: false
		};
	}
}
