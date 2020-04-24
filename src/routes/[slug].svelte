<script context="module">
    import { instance } from '../modules/Requests.js';
    import { writable } from 'svelte/store';
    const p = writable(false);
    export async function preload(page,session){
        p.set(false);
        if (/questions|discuss|tutorials|recent|saved/.test(page.params.slug)){
            var mode = page.params.slug;
            if(mode === 'saved' && session.auth === false){
                this.redirect(302,'/');
            }
        }else{
            this.error(404);
        }
        const res = await instance.get('/api/home?mode='+mode).then(function (response) {
            p.set(true);
            return response.data;
        });
        const json = await res;
        json['mode'] = mode;
        return { json: json };
    }
</script>
<script>
import SideBarLeft from '../components/SideBarLeft.svelte';
import SideBarRight from '../components/SideBarRight.svelte';
import Posts from '../components/Posts.svelte';
import { onMount, beforeUpdate, onDestroy  } from "svelte";
import { stores } from '@sapper/app';
const { page, session } = stores();

export let json;
let page_ = 1;
let isLoadMore = true, CanLoad = false;
let articles;
let trending;
let utilities;
let user;
let document_;

    trending = json['trending'];
    articles = json['posts'];
    if($session.auth){
        user = json['user'];
    }
    utilities = json['utilities'];


onMount(async function(){
    document_ = document;
    document.addEventListener("scroll", onScroll);
})

onDestroy(function(){
    if(document_)
        document_.removeEventListener("scroll", onScroll);
})

async function LoadMore(){
    page_++;
    await instance.get('/api/home/'+ page_ + '?mode='+json['mode'], { progress: false }).then(function (response) {
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

beforeUpdate(()=>{
    trending = json['trending'];
    articles = json['posts'];
    if($session.auth){
        user = json['user'];
    }
    utilities = json['utilities'];
})

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
</svelte:head>

<SideBarLeft user={user} utilities={utilities} loaded={$p}/>

<Posts onscroll={onScroll} articles={articles} loaded={$p}></Posts>

<SideBarRight trending={trending} page={"index"} loaded={$p}/>