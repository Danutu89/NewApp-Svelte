<script context="module">
    import { instance } from '../../modules/Requests.js';
    import { isSSR, lPage } from '../../modules/Preloads.js';
    lPage.set({data: '/api/home?tag=', refresh: false});
    export async function preload(page,session){
        let isSSRPage;
        const res = instance.get('/api/home?tag='+page.params.slug);
        lPage.set({data: '/api/home?tag=', refresh: false});
        isSSR.subscribe(value => {
            isSSRPage = value;
        })();

        if(!isSSRPage) {
            return { data: res };
        }
        const json = await res.then(function (response) {
            return response.data;
        });
        
        return {data: json};
    }
</script>
<script>
import Home from '../../components/Pages/Home.svelte'
import { onMount, onDestroy  } from "svelte";
import { stores } from '@sapper/app';
const { page, session } = stores();

export let data;
</script>

<svelte:head>
<title>NewApp - {$page.params.slug}</title>
<meta name="description" content="NewApp the newest community for developers to learn, share​ ​their programming ​knowledge, and build their careers.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://newapp.nl/">
<meta property="og:site_name" content="NewApp">
<meta property="og:image" itemprop="image primaryImageOfPage" content="https://newapp.nl/static/logo.jpg">
<meta property="og:description" content="The newest community for developers to learn, share​ ​their programming ​knowledge, and build their careers.">
<meta name="twitter:title" content="NewApp">
<meta name="twitter:description" content="The newest community for developers to learn, share​ ​their programming ​knowledge, and build their careers.">
<meta name="twitter:image:src" content="https://newapp.nl/static/logo.jpg">
</svelte:head>

{#if $lPage.refresh}
<Home mode={''}/>
{:else}
<Home data={data} mode={''}/>
{/if}

