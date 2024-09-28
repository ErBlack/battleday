import { EphemeralField } from '../field/ephemeral-field.js';
import { RealField } from '../field/real-field.js';

export class User {
	/**
	 * @type {RealField}
	 */
	personalField;
	/**
	 * @type {EphemeralField}
	 */
	enemyField;

	constructor() {
		this.personalField = new RealField();
		this.enemyField = new EphemeralField();
	}

	get ready() {
		return this.personalField.ships.length === 10;
	}

	get failed() {
		return this.ready && this.personalField.ships.every(({ destroyed }) => destroyed);
	}

	/**
	 * @param {User} Player
	 */
	async attack(Player) {
		const coordinate = await this.getShotTarget();

		const { hit, destroyed } = Player.applyEnemyShot(coordinate);

		this.enemyField.applyShotResult(coordinate, hit, destroyed);
	}

	/**
	 * @param {number} coordinate
	 * @returns
	 */
	applyEnemyShot(coordinate) {
		return this.personalField.applyEnemyShot(coordinate);
	}

	async placeShips() {
		throw new Error('Not implemented');
	}

	/**
	 * @returns {Promise<number>}
	 */
	async getShotTarget() {
		throw new Error('Not implemented');
	}

	reset() {
		this.personalField.reset();
		this.enemyField.reset();
	}
}
