/**
 * get cell index by coordinates
 *
 * @param {number} v
 * @param {number} h
 * @returns {number}
 */

export const getCellIndex = (v, h) => {
	return v * 10 + h;
};
