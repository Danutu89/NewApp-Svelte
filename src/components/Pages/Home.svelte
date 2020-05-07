<script>
import SideBarLeft from '../SideBarLeft.svelte';
import SideBarRight from '../SideBarRight.svelte';
import Posts from '../Posts.svelte';
import LSideBarLeft from '../Loading/SideBarLeft.svelte';
import LSideBarRight from '../Loading/SideBarRight.svelte';
import LPosts from '../Loading/Posts.svelte';
import {onMount, onDestroy} from 'svelte';
import {isSSR} from '../../modules/Preloads.js';

export let data, mode;
let async = undefined, posts = undefined;

onMount(async ()=>{
    if($isSSR) {
        isSSR.set(false);
    } else if(data instanceof Promise) {
        posts = async () => {
            const response = await data;
            if(response.status == 200) {
                const responseJson = await response;
                return responseJson.data;
            } else {
                throw new Error("Something went wrong");
            }
        }
        async = posts();
    }
})



</script>

{#if async}
    {#await async}
    <LSideBarLeft/>
    <LPosts/>
    <LSideBarRight page={"index"}/>
    {:then data}
    <SideBarLeft user={data.user} utilities={data.utilities}/>
    <Posts data={data.posts} mode={mode}/>
    <SideBarRight trending={data.trending} page={"index"}/>
    {:catch error}
    <p style="color: red">{error.message}</p>
    {/await}
{/if}
{#if (data instanceof Promise) == false}
    <SideBarLeft user={data.user} utilities={data.utilities}/>
    <Posts data={data.posts} mode={mode}/>
    <SideBarRight trending={data.trending} page={"index"}/>
{/if}

