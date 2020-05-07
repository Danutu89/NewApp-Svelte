import { writable } from 'svelte/store';
export const alert = writable({
    active: true,
    img: null,
    title: null,
    text: null,
    link: null
});
