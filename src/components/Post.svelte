
<script>

export let article;
import SideBarRight from '../components/SideBarRight.svelte';
import { onMount, beforeUpdate } from 'svelte';
import OpenJoin from '../modules/OpenJoin.js';
import axios from 'axios';
import marked from 'marked';
import { stores } from '@sapper/app';
const { page, session } = stores();

let like_button;
let like_counter;
let editor, editor_s;
let isMobile;

function Like_Post() {
    if($session.auth == false){
        OpenJoin();
    }
    if(like_button.classList.contains("na-heart")){
        var likes = parseInt(like_counter.innerHTML);
        var total = likes - 1;
        like_counter.innerHTML = total;
        like_button.classList.remove('na-heart');
        like_button.classList.add('na-heart1');
        like_button.classList.remove('heartscale');
    }else if(like_button.classList.contains("na-heart1")){
        var likes = parseInt(like_counter.innerHTML);
        var total = likes + 1;
        like_counter.innerHTML = total;
        like_button.classList.add('na-heart');
        like_button.classList.remove('na-heart1');
        like_button.classList.add('heartscale');
    }
    axios.get('https://newapp.nl/api/like-post/' + article.id +'?t=' + $session.token, {progress: false})
        .then(response => {
            if(response.status != 200){
                if(like_button.classList.contains("na-heart1")){
                    var likes = parseInt(like_counter.innerHTML);
                    var total = likes - 1;
                    like_counter.innerHTML = total;
                    like_button.classList.remove('na-heart');
                    like_button.classList.add('na-heart1');
                    like_button.classList.remove('heartscale');
                }else if(like_button.classList.contains("na-heart")){
                    var likes = parseInt(like_counter.innerHTML);
                    var total = likes + 1;
                    like_counter.innerHTML = total;
                    like_button.classList.add('na-heart');
                    like_button.classList.remove('na-heart1');
                    like_button.classList.add('heartscale');
                }
            }
            if(response.data['operation'] == 'failed'){
                if(like_button.classList.contains("na-heart1")){
                    var likes = parseInt(like_counter.innerHTML);
                    var total = likes - 1;
                    like_counter.innerHTML = total;
                    like_button.classList.remove('na-heart');
                    like_button.classList.add('na-heart1');
                    like_button.classList.remove('heartscale');
                }else if(like_button.classList.contains("na-heart")){
                    var likes = parseInt(like_counter.innerHTML);
                    var total = likes + 1;
                    like_counter.innerHTML = total;
                    like_button.classList.add('na-heart');
                    like_button.classList.remove('na-heart1');
                    like_button.classList.add('heartscale');
                }
            }
        })
}

async function Reply(){
    if(editor.value().length < 2){
        if(!editor_s){
            editor_s = document.querySelectorAll("textarea")[1];
        }
        editor_s.setCustomValidity('Please fill out this field.');
        editor_s.classList.add('error');
        editor_s.reportValidity();
        return;
    }
    let markdown = marked(editor.value());
    let reply;
    let json = await axios.post('https://newapp.nl/api/newreply', { content: markdown, token: $session.token, post_id: article.id }).then((response) =>{
        return response.data;
    })
    let data = await json;
    if (data['operation'] == 'success'){
        reply = {'text': markdown,author: {'id': $session.id, 'name': $session.name, 'avatar': $session.avatar, 'status': 'Online', 'reply_id': data['id']}};
        article.replies = [...article.replies,reply];
        editor.value("");
    }else if (data['operation'] == 'error'){
        console.log(data['error']);
    }
}

function Comment(){
    let reply = document.querySelector(".post-reply");
    if(reply.style["display"] === "none"){
        if(isMobile){
            reply.style["display"] = "block";
        }
        editor.codemirror.focus()
    }else{
        if(isMobile){
            reply.style["display"] = "none";
        }
    }
    if(isMobile === false){
        editor.codemirror.focus()
    }
    
}
async function CheckNotification(id){
    if($session.auth == false){
        return;
    }
    let args = "?t="+$session.token+"&not_id="+id;
    const not = await axios.get("https://newapp.nl/api/notifications/check"+args).then(response =>{
        if(response.status != 200){
            //alert
            return;
        }

        if(response.data['operation'] != "success"){
            //alert
            return;
        }

        return;
    })
}

beforeUpdate(async function(){
    if($page.query.notification_id){
        CheckNotification($page.query.notification_id);
    }
})

onMount(async function(){
    if($page.query.notification_id){
        CheckNotification($page.query.notification_id);
    }

    isMobile = window.matchMedia("only screen and (max-width: 1260px)").matches;
    let reply = document.querySelector(".post-reply");
    if (isMobile === true){
        if(reply.style['display'] == 'none')
        reply.style["display"] = "none";
    }else{
        reply.style["display"] = "block";
    }
    editor_s = document.querySelectorAll("textarea")[1];
    let SimpleMDE = require('simplemde');
    editor = new SimpleMDE({ element: document.getElementById("editor"), toolbar: false, status: false });
})


</script>

{#if article}
<div class="article">
    <div class="post">
        {#if article.thumbnail}
        <div class="thumbnail">
            <img loading="lazy" src="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg" alt="" style='width: 100%;border-top-left-radius: 20px;
            border-top-right-radius: 20px;'>
        </div>
        {/if}
        <div class="content-post" style="padding:0.8rem;">
                <div class="info" style="display:flex;">
                        <h1 style="margin-top: 0;font-weight: 400;font-size: 2rem;">{article.title}</h1>
                    </div>
                    <div class="post-author">
                        <img style="border-radius:50px;margin-right: 5px;" height="40px" width="40px"
                            src="{article.author.avatar}" alt="{article.author.name}">
                        <div class="author-info">
                            <a href="/user/{article.author.name}"><span class="author-name">{article.author.real_name}</span></a>
                            <div class="post-tags">
                                {#each article.tags as tag}
                                <a href="/tag/{tag}" style="font-size:13px;">
                                    <tag>{tag}</tag>
                                </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                    <div class="post_content" style="margin-top: 1.5rem;">
                        {@html article.text}
                    </div>
                    <br>
                    
                    <div class="user-actions">
                        {#if $session.auth}
                        {#if article.user['liked']}
                        <span style="cursor: pointer;margin-right:0.5rem;" on:click|preventDefault={Like_Post}><i id="heart"
                                class="na-heart" bind:this={like_button}></i>
                            <span>Like</span></span>
                        {:else}
                        <span style="cursor: pointer;margin-right:0.5rem;" on:click|preventDefault={Like_Post}><i id="heart"
                                class="na-heart1" bind:this={like_button}></i>
                            <span>Like</span></span>
                        {/if}
                        {:else}
                        <span style="cursor: pointer;margin-right:0.5rem;"><i id="heart"
                                class="na-heart1" on:click|preventDefault={Like_Post} bind:this={like_button}></i>
                            <span>Like</span></span>
                        {/if}
                        <span style="cursor: pointer;margin-right:0.5rem;" on:click|preventDefault={Comment}><i id="comment"
                                class="na-comment"></i>
                            <span>Comment</span></span>
                        <span id="share" style="cursor: pointer;"><i class="na-share"></i> <span>Share</span></span>
                        <div id="share-options" class="share_post">
                            <div class="list">
                                Share
                                <hr>
                                <div class="item"><i class="na-facebook-square"></i> Facebook</div>
                                <div class="item"><i class="na-twitter"></i> Twitter</div>
                                <div class="item"><i class="na-globe"></i> Hacker News</div>
                            </div>
                        </div>
                    </div>
                    <div class="user-actions-info">
                        <span><span id="hearts" bind:this={like_counter}>{article.likes}</span> Likes</span>
                    </div>
                    {#if article.closed == false}
                    <div class="post-reply" style="margin-top:3%;">
                        <textarea class="editor" id="editor" style="margin-bottom:1%;" minlength="0"  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
                        <div style="display:flex;">
                        <button class="reply-button" on:click={Reply} style="margin-inline-start:auto;">Post Reply</button>
                        </div>
                    </div>
                    {:else}
                    <div class="card" style="padding: 0.5rem;
                    text-align: center;
                    margin-top: 1rem;">
                        <div class="card-body">
                            <p><i class="fal fa-lock"></i> Post closed by {article.closed_by} on {article.closed_on}</p>
                        </div>
                    </div>
                    {/if}
        </div>
        
        
    </div>
    {#each article.replies as reply}
    <div class="reply" id="reply_{reply.id}">

        {@html reply.text}

        <br>
        <div class="info" style="display: flex">
            <div  style="margin-inline-start: auto;display:flex;">
                <div id="reply_img_{reply.author.id}" class="author" style="
                    border-radius: 20px;
                    padding: 0.5rem;
                    background-color: rgb(239, 240, 241);
                    display: flex;">
                    <img style="border-radius:20px;margin-right: 5px;" height="35px" width="35px"
                        src="{reply.author.avatar}" alt="{reply.author.name}">
                    <div id="reply_name_{reply.author.id}" style="margin-top:-0.1rem;">
    
                        <a id="reply_name" style="color: #333;font-size: 1rem;"
                            href="/user/{reply.author.id}">@{reply.author.name}</a>
                        <p style="font-size: 60%;opacity: 0.6;margin-bottom: 0;margin-top: 0;">
                            { reply.author.status }
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    {/each}
    <br>
    <p style="margin-top: 1rem; font-size:initial;color:var(--color);">Not the answer you're looking for? Browse other questions tagged
        {#each article.tags as tag}<a href="/tag/{tag}"
            style="font-size:13px;margin-left:3px;"><tag>{tag}</tag> </a>{/each}
        {#if $session.auth}or <a href="/newpost" rel="prefetch" style="color:#18BC9C;"> ask your own question</a>{/if}.</p>
</div>
{/if}

<SideBarRight author={article.author} user={article.user} article={article} page={"post"}/>