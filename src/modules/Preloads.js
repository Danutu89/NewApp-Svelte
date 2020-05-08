import { writable } from 'svelte/store';
export const isSSR = writable(true);
export const lPage = writable({data: null, refresh: false});