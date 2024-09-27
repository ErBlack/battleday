import { getNextCellIndex } from '../field/getNextCellIndex.js';
import { getPrevCellIndex } from '../field/getPrevCellIndex.js';
import { isFirstCell } from '../field/isFirstCell.js';
import { isLastCell } from '../field/isLastCell.js';

/**
 * @param {'v' | 'h'} direction
 * @param {number[]} coordinates
 * @returns
 */
export const getAroundCoordinates = (direction, coordinates) => {
	/**
	 * @type {number[]}
	 */
	const aroundCoordinates = [];

	const rows = direction === 'v' ? coordinates.map((coordinate) => [coordinate]) : [coordinates];

	rows.forEach((cols, rowIndex, arr) => {
		const isFirstRow = rowIndex === 0;
		const isLastRow = rowIndex === arr.length - 1;

		cols.forEach((coordinate, colIndex, arr) => {
			const isFirstCol = colIndex === 0;
			const isLastCol = colIndex === arr.length - 1;

			const prevHorizontalAllowed = isFirstCol && !isFirstCell('h', coordinate);
			const nextHorizontalAllowed = isLastCol && !isLastCell('h', coordinate);
			const prevVerticalAllowed = isFirstRow && !isFirstCell('v', coordinate);
			const nextVerticalAllowed = isLastRow && !isLastCell('v', coordinate);

			if (prevHorizontalAllowed) {
				aroundCoordinates.push(getPrevCellIndex('h', coordinate));

				if (prevVerticalAllowed) {
					aroundCoordinates.push(getPrevCellIndex('v', getPrevCellIndex('h', coordinate)));
				}

				if (nextVerticalAllowed) {
					aroundCoordinates.push(getNextCellIndex('v', getPrevCellIndex('h', coordinate)));
				}
			}

			if (nextHorizontalAllowed) {
				aroundCoordinates.push(getNextCellIndex('h', coordinate));

				if (prevVerticalAllowed) {
					aroundCoordinates.push(getPrevCellIndex('v', getNextCellIndex('h', coordinate)));
				}

				if (nextVerticalAllowed) {
					aroundCoordinates.push(getNextCellIndex('v', getNextCellIndex('h', coordinate)));
				}
			}

			if (prevVerticalAllowed) {
				aroundCoordinates.push(getPrevCellIndex('v', coordinate));
			}

			if (nextVerticalAllowed) {
				aroundCoordinates.push(getNextCellIndex('v', coordinate));
			}
		});
	});

	return aroundCoordinates.sort((a, b) => a - b);
};
