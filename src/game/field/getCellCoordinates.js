/**
 * @param {number} index
 * @returns
 */

export const getCellCoordinates = (index) => {
	return {
		x: index % 10,
		y: Math.floor(index / 10)
	};
};
