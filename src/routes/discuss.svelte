<script context="module">
    import axios from 'axios';
    export async function preload(page,session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token + '&mode=discuss';
        }
        const res = await axios.get('https://newapp.nl/api/home' + args).then(function (response) {
                return response.data;
            });
        const json = await res;
        return { saved: json };
    }
</script>
<script>
import SideBarLeft from '../components/SideBarLeft.svelte';
import SideBarRight from '../components/SideBarRight.svelte';
import Posts from '../components/Posts.svelte';
import { onMount, beforeUpdate, onDestroy } from "svelte";
import { stores } from '@sapper/app';
const { session } = stores();

export let saved;
let page = 1;
let isLoadMore = true, CanLoad = false;
let articles;
let trending;
let utilities;
let user;
let document_;
trending = saved['trending'];
articles = saved['posts'];
if($session.auth){
    user = saved['user'];
}
utilities = saved['utilities'];

onMount(async function(){
    document_ = document;
    document.addEventListener("scroll", onScroll);
})

onDestroy(function(){
    if(document_)
        document_.removeEventListener("scroll", onScroll);
})

async function LoadMore(){
    if($session.auth){
        page++;
        await axios.get('https://newapp.nl/api/home/'+ page +'?t=' + $session.token + '&mode=discuss', { progress: false }).then(function (response) {
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
<title>New App - Where Developers Learn, Share, & Code</title>
</svelte:head>

<SideBarLeft user={user} utilities={utilities}/>

<Posts onscroll={onScroll} articles={articles}></Posts>

<SideBarRight trending={trending} page={"index"}/>