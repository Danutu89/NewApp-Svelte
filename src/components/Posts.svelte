<script>
import {instance} from '../modules/Requests.js';
import OpenJoin from '../modules/OpenJoin.js';
import SPost from './Loading/SPost.svelte';
import { stores } from '@sapper/app';
const { session } = stores();
import {host} from '../modules/Options.js';
import {onMount, onDestroy} from 'svelte';

export let data, mode, user;
let save_button = [];
let document_;
let page_ = 1;
let isLoadMore = true, CanLoad = false;
let loadPosts;

function SavePost(id){
    if ($session.auth == false){
        OpenJoin();
        return;
    }
    instance.get('/api/save-post/' + id, { progress: false }).then(response=>{
        if(response.data['operation'] == 'saved'){
            save_button[id].innerHTML = 'Saved';
        }else if(response.data['operation'] == 'deleted'){
            save_button[id].innerHTML = 'Save';
        }
    })

}

onMount(()=>{
    document_ = document;
    document.addEventListener("scroll", onScroll);
})

onDestroy(function(){
    if(document_)
        document_.removeEventListener("scroll", onScroll);
})

function LoadMore(){
    page_++;
    var args;
    if(user){
        args =  '?mode='+mode + "&user=" + user;
    }else{
        args =  '?mode='+mode;
    }
    loadPosts = instance.get('/api/home/'+ page_ + args, { progress: false }).then(function (response) {
        data = [...data , ...response.data['posts']];
        data = data;
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
    if (offset <= 400) {
        if (!CanLoad && isLoadMore) {
            LoadMore();
        }
        CanLoad = true;
    } else {
        CanLoad = false;
    }
    
};

</script>

<div class="articles">
    <div class="navigation-menu">
        <a href="/"><button>Home</button></a>
        <a href="/questions"><button>Questions</button></a>
        <a href="/discuss"><button>Discuss</button></a>
        <a href="/tutorials"><button>Tutorials</button></a>
    </div>
    {#each data as article}
        <div class="article-card" id="post_{article.id}">
        {#if article.thumbnail}
        <div class="article-thumbnail" style="max-height:300px;overflow: hidden;">
                        <img loading="lazy" alt="" onerror="this.style.display='none'"
                        data="/static/thumbnail_post/post_{article.id}.jpeg" style="border-top-left-radius: 8px;
                        border-top-right-radius: 8px;object-fit: cover;">
                </div>
        {/if}
        <div class="article-main">
                <div class="article-author-image"><img class="profile_image" onerror="this.style.display='none'"
                    loading="lazy" data="{article.author.avatar}" height="50px" width="50px" title="profile image" alt="{article.author.name}">
                </div>
                <div class="article-info">
                    <div class="article-title"><a rel="prefetch" href="/post/{article.link}"><h1 style="font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;">{article.title}</h1></a></div>
                    <a rel="prefetch" href="/user/{article.author.name}"><div class="article-author">Author: {article.author.name}</div></a>
                    <div class="article-tags">
                        <span>Tags: </span>
                        {#each article.tags as tag}
                        <a href="/tag/{tag}" rel="prefetch" style="margin-right: 0.1rem;"><tag class="article-tag">{tag}</tag></a>
                        {/each}
                    </div>
                </div>
                </div>
                <div class="article-footbar">
                <div class="article-date">Published {article.posted_on} ago</div>
                <div class="article-misc">
                        <span class="article-readtime" style="font-size: 0.8rem;color: grey;margin-right: 0.4rem;">
                            {article.read_time}
                        </span>
                        <button class="article-save" id="save-{article.id}" bind:this={save_button[article.id]} on:click={()=>SavePost(article.id)}>{#if $session.auth}{#if article.saved}Saved{:else}Save{/if}{:else}Save{/if}</button>
                </div>
                </div>
            </div>
    {/each}
    {#if (loadPosts instanceof Promise ) == true}
        {#await loadPosts}
            {#each Array(2) as x}
                <SPost/>
            {/each}
        {/await}
    {/if}
</div>