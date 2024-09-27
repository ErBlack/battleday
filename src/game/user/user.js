/**
 * @typedef {import('../ship/real-ship.js').RealShip} RealShip
 * @typedef {import('../field/real-field.js').RealField} RealField
 * @typedef {import('../field/ephemeral-field.js').EphemeralField} EphemeralField
 */

export class User {
	/**
	 * @type {RealField}
	 */
	personalField;
	/**
	 * @type {EphemeralField}
	 */
	enemyField;

	/**
	 * @param {RealField} realField
	 * @param {EphemeralField} ephemeralField
	 */
	constructor(realField, ephemeralField) {
		this.personalField = realField;
		this.enemyField = ephemeralField;
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
}
