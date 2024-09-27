/**
 * @param {number} min
 * @param {number} max
 */
export const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};
