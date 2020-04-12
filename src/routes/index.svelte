<script>
import { onMount, onDestroy } from "svelte";
import SideBarLeft from '../components/SideBarLeft.svelte';
import SideBarRight from '../components/SideBarRight.svelte';
import Posts from '../components/Posts.svelte';
import { host } from '../modules/Options.js';
import axios from 'axios';
import { stores } from '@sapper/app';
const { session } = stores();
export let home = [];
export let articles = [];
export let trending = [];
export let user;
export let utilities;
let page_articles = [];
let page = 1;
let isLoadMore = true, CanLoad = false;
let args = "";
let document_;

if ($session.auth){
    args = "?t="+$session.token;
}

onMount(async function() {
	const res = await axios.get(host+'/api/home'+args).then(function (response) {
        return response.data;
    });
	const json = await res;
    home = json;
    trending = home['trending'];
    articles = home['posts'];
    if($session.auth){
        user = home['user'];
    }
    utilities = home['utilities'];
    document_ = document;
    document.addEventListener("scroll", onScroll);
});

onDestroy(function(){
    if(document_)
        document_.removeEventListener("scroll", onScroll);
})

async function LoadMore(){
    page++;
    await axios.get(host+'/api/home/'+ page + args, { progress: false }).then(function (response) {
        articles = [...articles , ...response.data['posts']];
        articles = articles;
        if (response.data['hasnext']){
            isLoadMore = true;
        }
        else{
            isLoadMore = false;
        }
    });
}

function onScroll(e) {
    const offset = document.documentElement.scrollHeight-document.documentElement.clientHeight-document.documentElement.scrollTop;
    if (offset <= 200) {
        if (!CanLoad && isLoadMore) {
            LoadMore();
        }
        CanLoad = true;
    } else {
        CanLoad = false;
    }
    
};

</script>

<svelte:head>
<title>NewApp - Where Developers Learn, Share, & Code</title>
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


<SideBarLeft user={user} utilities={utilities}/>

<Posts onscroll={onScroll} articles={articles}></Posts>

<SideBarRight trending={trending} page={"index"}/>

