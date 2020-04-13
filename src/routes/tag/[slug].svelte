<script context="module">
    import axios from 'axios';
    import { host } from '../../modules/Options.js';
    export async function preload(page,session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token + '&tag=' + page.params.slug;
        }else{
            args = '?tag=' + page.params.slug; 
        }
        try {
            const res = await axios.get(host+'/api/home'+ args).then(function (response) {
                return response.data;
            });
            const json = await res;
            return { tag: json };
        } catch (error) {
            return this.error(404, 'Not Found');
        }
        
    }
</script>
<script>
import SideBarLeft from '../../components/SideBarLeft.svelte';
import {wrapper} from '../../modules/Variables.js';
import SideBarRight from '../../components/SideBarRight.svelte';
import Posts from '../../components/Posts.svelte';
import { onMount, beforeUpdate  } from "svelte";
import { stores } from '@sapper/app';
const { session } = stores();
const wrapper_ = wrapper;

export let tag;
let page = 1;
let isLoadMore = true, CanLoad = false;
let articles;
let trending;
let utilities;
let user;
let sidebar, overflow, navbar;
trending = tag['trending'];
articles = tag['posts'];
if($session.auth){
    user = tag['user'];
}
utilities = tag['utilities'];

let title = tag.info['name'][0].toUpperCase() + tag.info['name'].slice(1);

onMount(async function(){
    sidebar = document.getElementById("sidebar-left");
    overflow = document.querySelector("overflow");
    navbar = document.getElementById("navbar");
    document.addEventListener("scroll", onScroll);
    wrapper_.setTrue(sidebar,overflow,navbar);
})

beforeUpdate(()=>{
    trending = tag['trending'];
    articles = tag['posts'];
    if($session.auth){
        user = tag['user'];
    }
    utilities = tag['utilities'];
    title = tag.info['name'][0].toUpperCase() + tag.info['name'].slice(1);
    if(overflow && sidebar)
    wrapper_.setTrue(sidebar,overflow,navbar);
})

async function LoadMore(){
    page++;
    await axios.get('https://newapp.nl/api/home/'+ page +'?tag=' + page.params.slug, { progress: false }).then(function (response) {
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
<title>NewApp - {title}</title>
</svelte:head>

<SideBarLeft user={user} utilities={utilities}/>

<Posts onscroll={onScroll} articles={articles}></Posts>

<SideBarRight trending={trending} page={"index"}/>