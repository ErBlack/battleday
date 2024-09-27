/**
 * Check if cell is last in row or column
 * @param {'v'|'h'} direction
 * @param {number} index
 * @returns {boolean}
 */
export const isLastCell = (direction, index) => {
	if (direction === 'v') {
		return index >= 90;
	} else {
		return index % 10 === 9;
	}
};
