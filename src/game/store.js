import { writable } from 'svelte/store';
import { getDefaultFieldStore } from './field/getDefaultFieldStore.js';

export const gameOpen = writable(
	typeof location !== 'undefined' && location.search.includes('debug')
);

export const player1Field = writable(getDefaultFieldStore());
export const player1PreviewField = writable(getDefaultFieldStore());
export const player2Field = writable(getDefaultFieldStore());
export const player2PreviewField = writable(getDefaultFieldStore());
