<script>
import { onMount } from 'svelte';
import { alert } from '../modules/Alert.js';
import { goto } from '@sapper/app';

let el;

onMount(()=>{
    setTimeout(() => {
        el.classList.remove("active");
        setTimeout(()=>{
            alert.set({
                active: false,
                img: null,
                title: null,
                text: null,
                link: null
            });
        }, 200)
    }, 4000);
});
//TODO: Improve alert design
</script>



<alert class="active" bind:this={el}>
    <div class="img" on:click={()=>{goto($alert.link)}}>
        <img data="{$alert.img}" alt="logo" height="35px">
    </div>
    <div class="body" on:click={()=>{goto($alert.link)}}>
        <div class="title">{$alert.title}</div>
        <div class="text">{$alert.text}</div>
    </div>
    <div class="close" on:click={()=>{el.classList.remove("active")}}>&times;</div>
</alert>

<style>
alert {
    display: flex;
    padding: 0.5rem 1rem;
    background-color: var(--secondary-background);
    position: fixed;
    border-radius: 8px;
    bottom: 0;
    left: 0.5rem;
    -webkit-transform: translateY(60px);
    transform: translateY(60px);
    transition: transform 200ms linear;
    box-shadow: 5px 5px 11px 0px rgba(0, 0, 0, 0.2);
    color: var(--color);
    z-index: 5;
    cursor: pointer;
}

alert.active {
    -webkit-transform: translateY(-10px);
    transform: translateY(-10px);
    transition: transform 200ms linear;
}

alert .img {
    margin-right: 0.5rem;
    height: 40px;
    width: 30px;
    border-radius: 40px;
    display: flex;
}

alert .img img{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

alert .body {
    line-height: 1.35;
    font-family: sans-serif;
}

alert .close {
    font-size: 1.5rem;
    line-height: 1;
    margin-top: -0.5rem;
    margin-right: -0.5rem;
    cursor: pointer;
}
</style>