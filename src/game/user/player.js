import { RealShip } from '../ship/real-ship.js';
import { ships } from './ships.js';
import { User } from './user.js';

/**
 * @typedef {import('../field/real-field.js').RealField} RealField
 * @typedef {import('../field/ephemeral-field.js').EphemeralField} EphemeralField
 */

export class Player extends User {
	/**
	 * @param {RealField} realField
	 * @param {EphemeralField} ephemeralField
	 */
	constructor(realField, ephemeralField) {
		super(realField, ephemeralField);
	}

	async getShotTarget() {
		return await this.enemyField.requestShootTarget();
	}

	async placeShips() {
		for (const size of ships) {
			const { direction, start } = await this.personalField.requestShipPlacement(size);

			const ship = new RealShip(size, direction, start);

			this.personalField.addShip(ship);
		}
	}
}
