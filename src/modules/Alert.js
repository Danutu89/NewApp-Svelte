import { writable } from 'svelte/store';
export const alert = writable({
    active: false,
    img: null,
    title: null,
    text: null,
    link: null
});

export function activateAlert(img, title, text, link){
    alert.set({
        active: true,
        img: img,
        title: title,
        text: text,
        link: link
    });
}
