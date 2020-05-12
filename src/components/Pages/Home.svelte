<script>
import SideBarLeft from '../SideBarLeft.svelte';
import SideBarRight from '../SideBarRight.svelte';
import Posts from '../Posts.svelte';
import LSideBarLeft from '../Loading/SideBarLeft.svelte';
import LSideBarRight from '../Loading/SideBarRight.svelte';
import LPosts from '../Loading/Posts.svelte';
import {onMount, onDestroy} from 'svelte';
import {isSSR, lPage} from '../../modules/Preloads.js';
import { instance } from '../../modules/Requests.js';
import { stores, goto } from '@sapper/app';
const { page } = stores();

export let data, mode;
let async = undefined, posts = undefined;

onMount(async ()=>{
    let loadEvent = new CustomEvent('reloaded');
    if($isSSR && $lPage.refresh == false) {
        isSSR.set(false);
    } else if(data instanceof Promise || $lPage.refresh == true) {
        posts = async () => {
            let promise, response;
            if($lPage.refresh){
                if($page.path == '/search')
                    promise = $lPage.data+''+$page.query.q;
                else if($page.path == '/tag/'+$page.params.slug)
                   promise = $lPage.data+''+$page.params.slug;
                else
                    promise = $lPage.data;
                response = await instance.get(promise);
            }
            else
                response = await data;
            if(response.status == 200) {
                const responseJson = await response;
                if($lPage.refresh == true)
                    document.dispatchEvent(loadEvent);
                lPage.set({data: $lPage.data, refresh: false});
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
{#if (data instanceof Promise) == false && $lPage.refresh == false}
    <SideBarLeft user={data.user} utilities={data.utilities}/>
    <Posts data={data.posts} mode={mode}/>
    <SideBarRight trending={data.trending} page={"index"}/>
{/if}

