import { random } from './random.js';

/**
 * @template T
 * @param {T[]} array
 * @returns T
 */
export const randomArrayElement = (array) => array[random(0, array.length)];
