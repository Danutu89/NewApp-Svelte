<script>
import { onMount } from "svelte";
import SideBarLeft from '../components/SideBarLeft.svelte';
import SideBarRight from '../components/SideBarRight.svelte';
import Posts from '../components/Posts.svelte';
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

if ($session.auth){
    args = "?t="+$session.token;
}

onMount(async function() {
	const res = await axios.get('https://newapp.nl/api/home'+args).then(function (response) {
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
    document.addEventListener("scroll", onScroll);
});

async function LoadMore(){
    page++;
    await axios.get('https://newapp.nl/api/home/'+ page + args, { progress: false }).then(function (response) {
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
<title>NewApp</title>
</svelte:head>


<SideBarLeft user={user} utilities={utilities}/>

<Posts onscroll={onScroll} articles={articles}></Posts>

<SideBarRight trending={trending} page={"index"}/>

