import { writable } from 'svelte/store';

export const start = new Date('2024-10-12T14:00:00Z');
export const easter = new Date('2024-10-05T08:00:00Z');

export const easterAvailable = writable(
	(typeof location !== 'undefined' && location.search.includes('debug')) || Date.now() >= easter
);
