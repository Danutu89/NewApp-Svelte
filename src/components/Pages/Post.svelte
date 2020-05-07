<script>
import SideBarRight from '../SideBarRight.svelte';
import Post from '../Post.svelte';
import LSideBarRight from '../Loading/SideBarRight.svelte';
import LPost from '../Loading/Post.svelte';
import {onMount, onDestroy} from 'svelte';
import {isSSR} from '../../modules/Preloads.js';
import { stores } from '@sapper/app';
const { page } = stores();

export let data;
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

<svelte:head>
{#if (data instanceof Promise) == false}
<title>{data.title} - NewApp</title>
<meta name="description" content="{data.description}...">
<meta property="og:type" content="website">
<meta property="og:url" content="/post/{$page.params.slug}">
<meta property="og:site_name" content="{data.title}">
<meta name="twitter:title" content="{data.title}">
{#if data.thumbnail}
<meta property="og:image" itemprop="image primaryImageOfPage" content="https://newapp.nl/static/thumbnail_post/post_{data.id}.jpeg">
<meta name="twitter:image:src" content="https://newapp.nl/static/thumbnail_post/post_{data.id}.jpeg">
{:else}
<meta property="og:image" itemprop="image primaryImageOfPage" content="{data.author.avatar}">
<meta name="twitter:image:src" content="{data.author.avatar}">
{/if}
<meta property="og:description" content="{data.description}...">
<meta name="twitter:description" content="{data.description}...">
<meta name="keywords" content="{data.keywords}newapp">
{/if}
{#if async}
    {#await async}
    <title>Loading... - NewApp</title>
    {:then data}
    <title>{data.title} - NewApp</title>
    <meta name="description" content="{data.description}...">
    <meta property="og:type" content="website">
    <meta property="og:url" content="/post/{$page.params.slug}">
    <meta property="og:site_name" content="{data.title}">
    <meta name="twitter:title" content="{data.title}">
    {#if data.thumbnail}
    <meta property="og:image" itemprop="image primaryImageOfPage" content="https://newapp.nl/static/thumbnail_post/post_{data.id}.jpeg">
    <meta name="twitter:image:src" content="https://newapp.nl/static/thumbnail_post/post_{data.id}.jpeg">
    {:else}
    <meta property="og:image" itemprop="image primaryImageOfPage" content="{data.author.avatar}">
    <meta name="twitter:image:src" content="{data.author.avatar}">
    {/if}
    <meta property="og:description" content="{data.description}...">
    <meta name="twitter:description" content="{data.description}...">
    <meta name="keywords" content="{data.keywords}newapp">
    {/await}
{/if}
<script async src="https://newappcdn.b-cdn.net/prettify.js"></script>
</svelte:head>

{#if async}
    {#await async}
    <LPost/>
    <LSideBarRight page={"post"}/>
    {:then data}
    <Post article={data}/>
    <SideBarRight author={data.author} user={data.user} article={data} page={"post"}/>
    {:catch error}
    <p style="color: red">{error.message}</p>
    {/await}
{/if}
{#if (data instanceof Promise) == false}
    <Post article={data}/>
    <SideBarRight author={data.author} user={data.user} article={data} page={"post"}/>
{/if}