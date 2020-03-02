<script context="module">
    import axios from 'axios';
    
    export async function preload(page, session){
        let search = page.query.q;
        let args = '?search=' + search;
        if (session.auth){
            args+= '&t='+session.token;
        }
        const res = await axios.get(host+'/api/home' + args).then(function (response) {
                return response.data;
            });
        const json = await res;
        return { search: json };
    }
</script>

<script>
import SideBarLeft from '../components/SideBarLeft.svelte';
import SideBarRight from '../components/SideBarRight.svelte';
import Posts from '../components/Posts.svelte';
import { onMount, beforeUpdate, onDestroy  } from "svelte";
import { stores } from '@sapper/app';
const { session } = stores();

export let search;
let page = 1;
let isLoadMore = true, CanLoad = false;
let articles;
let trending;
let utilities;
let user;
let document_;
trending = search['trending'];
articles = search['posts'];
if($session.auth){
    user = search['user'];
}
utilities = search['utilities'];

onMount(async function(){
    document_ = document;
    document.addEventListener("scroll", onScroll);
})

beforeUpdate(()=>{
    trending = search['trending'];
    articles = search['posts'];
    if($session.auth){
        user = search['user'];
    }
    utilities = search['utilities'];

})

onDestroy(function(){
    if(document_)
        document_.removeEventListener("scroll", onScroll);
})

async function LoadMore(){
    page++;
    await axios.get(host+'/api/home/'+ page +'?search=' + search, { progress: false }).then(function (response) {
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
<title>Search - {search.utilities['search']}</title>
</svelte:head>

<SideBarLeft user={user} utilities={utilities}/>

<Posts onscroll={onScroll} articles={articles}></Posts>

<SideBarRight trending={trending} page={"index"}/>