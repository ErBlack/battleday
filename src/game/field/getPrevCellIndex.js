/**
 * Get prev cell index
 * @param {'v'|'h'} direction
 * @param {number} i
 * @returns {number}
 */

export const getPrevCellIndex = (direction, i) => {
	if (direction === 'v') {
		return i - 10;
	} else {
		return i - 1;
	}
};
