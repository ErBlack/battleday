import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';

/**
 * @typedef {import('svelte/store').Writable<true|false|null>} WinnerState
 */

/**
 * @type {WinnerState}
 */
export const winner = writable(null);

export const winCode = persisted('batteledayWinCode', '');

export const gameActivated = persisted('battledayGameActivated', false);

export const gameOpen = writable(false);
