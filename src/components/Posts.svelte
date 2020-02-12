<script>
import axios from 'axios';
import OpenJoin from '../modules/OpenJoin.js';
import { stores } from '@sapper/app';
const { session } = stores();

export let articles;
export let user;
let save_button = [];

function SavePost(id){
    if ($session.auth == false){
        OpenJoin();
        return;
    }
    axios.get('https://newapp.nl/api/save-post/' + id + '?t=' + $session.token, { progress: false }).then(response=>{
        if(response.data['operation'] == 'saved'){
            save_button[id].innerHTML = 'Saved';
        }else if(response.data['operation'] == 'deleted'){
            save_button[id].innerHTML = 'Save';
        }
    })
}

</script>

{#if user}
{#each articles as article}
    <div class="article-card" id="post_{article.id}" >
    <div class="article-main">
                <div class="article-author-image"><img class="profile_image"
                loading="lazy" src="{article.author.avatar}" height="50px" width="50px" title="profile image" alt="{article.author.name}">
            </div>
            <div class="article-info">
                <div class="article-title"><a rel="prefetch" href="/post/{article.link}"><h1 style="font-size: 1.5rem;
                    font-weight: 400;
                    margin: 0;">{article.title}</h1></a></div>
                <div class="article-author">Author: {article.author.name}</div>
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
{:else}
<div class="articles">
	{#each articles as article}
		<div class="article-card" id="post_{article.id}">
        {#if article.thumbnail}
        <div class="article-thumbnail" style="max-height:300px;overflow: hidden;">
                        <img loading="lazy" alt=""
                          src="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg" style="border-top-left-radius: 20px;
                          border-top-right-radius: 20px;object-fit: cover;">
                </div>
        {/if}
		<div class="article-main">
                 <div class="article-author-image"><img class="profile_image"
                    loading="lazy" src="{article.author.avatar}" height="50px" width="50px" title="profile image" alt="{article.author.name}">
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
</div>
{/if}