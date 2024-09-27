import { getCellCoordinates } from './getCellCoordinates.js';

const defaultFieldStore = JSON.stringify(
	new Array(100).fill(null).map((_, i) => ({
		coordinate: i,
		...getCellCoordinates(i),
		shot: false,
		ship: false,
		around: false
	}))
);

/**
 * @typedef {Object} CellDescriptor
 * @property {number} coordinate;
 * @property {number} x;
 * @property {number} y;
 * @property {boolean} shot;
 * @property {boolean} ship;
 * @property {boolean} around;
 */

/**
 * @returns {CellDescriptor[]}
 */
export const getDefaultFieldStore = () => JSON.parse(defaultFieldStore);
