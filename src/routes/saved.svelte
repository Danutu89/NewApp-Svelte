<script context="module">
    import { instance } from '../modules/Requests.js';
    import { isSSR } from '../modules/Preloads.js';
    export async function preload(page,session){
        let isSSRPage;
        if(session.auth === false){
            this.redirect(302,'/');
        }
        const res = instance.get('/api/home?mode=saved');
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
import Home from '../components/Pages/Home.svelte'
import { onMount, onDestroy  } from "svelte";
import { stores } from '@sapper/app';
const { page, session } = stores();

export let data;
</script>

<svelte:head>
<title>NewApp - Saved</title>
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

<Home data={data} mode={'saved'}/>