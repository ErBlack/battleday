/**
 * Check if cell is first in row or column
 * @param {'v'|'h'} direction
 * @param {number} index
 * @returns {boolean}
 */
export const isFirstCell = (direction, index) => {
	if (direction === 'v') {
		return index < 10;
	} else {
		return index % 10 === 0;
	}
};
