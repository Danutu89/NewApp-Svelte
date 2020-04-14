
<script>

export let article;
import { onMount, beforeUpdate } from 'svelte';
import OpenJoin from '../modules/OpenJoin.js';
import { host } from '../modules/Options.js';
import axios from 'axios';
import TurndownService from 'turndown';
import marked from 'marked';
import { stores } from '@sapper/app';
const { page, session } = stores();

let like_button;
let like_counter;
let editor, editor_s;
let isMobile;
let turndown = TurndownService();

let editing=false;
let editing_id;

let webview = false;

let dark_theme;

article.replies.forEach(reply => {
    reply.mentions.forEach(mention => {
        reply.text = String(reply.text).replace("@"+mention, '<a href="/user/'+mention+'">@'+mention+'</a>');
    });
});

var loadCss = function(cssPath){
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = cssPath;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(cssLink);
};

function Like_Post() {
    if($session.auth == false){
        OpenJoin();
        return;
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
    axios.get(host+'/api/like-post/' + article.id +'?t=' + $session.token, {progress: false})
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
    if($session.auth == false){
        OpenJoin();
        return;
    }
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
    let json = await axios.post(host+'/api/newreply', { content: markdown, token: $session.token, post_id: article.id }).then((response) =>{
        return response;
    })
    let data = await json;
    if (data.status != 200){
        //alert
        return;
    }

    if (data.data['operation'] != 'success'){
        //alert
        console.log(data.data['error']);
        return;
    }

    reply = {'id': data.data['reply_id'], 'text': markdown,author: {'id': $session.id, 'name': $session.name, 'avatar': $session.avatar, 'status': 'Online', 'reply_id': data['id']}};
    article.replies = [...article.replies,reply];
    PR.prettyPrint();
    editor.value("");
}

function Comment(){
    if($session.auth == false){
        OpenJoin();
        return;
    }
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

async function Delete_Reply(id){
    if($session.auth == false){
        return;
    }
    let args = "?t="+$session.token+"&id="+id;
    const not = await axios.get(host+"/api/reply/delete"+args).then(response =>{
        if(response.status != 200){
            //alert
            return;
        }

        if(response.data['operation'] != "success"){
            //alert
            return;
        }

        document.getElementById("reply_"+id).remove();

        return;
    })
}

function Cancel_Reply(){
    if(editing){
        editing = false;
        editing_id = null;
        editor.value("");
    }
}

function Edit_Reply(reply){
    editing_id = reply;
    editing = true;
    if ( isMobile )
        Comment();
    editor.value(turndown.turndown(reply.text_e));
    editor.codemirror.focus();
}

async function C_Edit_Reply(){
    if($session.auth == false && $session.id != editing_id.author.id || $session.permissions.edit_reply_permission == false){
        return;
    }
    let args = "?t="+$session.token+"&id="+editing_id.id;
    const resp = await axios.post(host+"/api/reply/edit",{content: marked(editor.value()), r_id: editing_id.id, token: $session.token}).then(response =>{
        if(response.status != 200){
            //alert
            return;
        }

        if(response.data['operation'] != "success"){
            //alert
            return;
        }

        let replies = article.replies;
        replies.forEach(reply => {
            if(reply.id == editing_id.id){
                reply.text = marked(editor.value());
                reply.mentions.forEach(mention => {
                    reply.text = String(reply.text).replace("@"+mention, '<a href="/user/'+mention+'">@'+mention+'</a>');
                });
            }
        });
        article.replies = replies;
        editing_id = null;
        editing = false;
        editor.value("");
        PR.prettyPrint();
        return;
    })
    
}

async function CheckNotification(id){
    if($session.auth == false){
        return;
    }
    let args = "?t="+$session.token+"&not_id="+id;
    const not = await axios.get(host+"/api/notifications/check"+args).then(response =>{
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
    var ua = navigator.userAgent;
    if (ua.includes('wv') && $session.auth == false) {
        OpenJoin();
        webview = true;
    } else {
        webview = false;
    }

    isMobile = window.matchMedia("only screen and (max-width: 1260px)").matches;
    if(article.closed == false){
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
    }
    loadCss("https://newappcdn.b-cdn.net/dark_code.css");
})


</script>

{#if article}
<div class="article">
    <div class="post">
        {#if article.thumbnail}
        <div class="thumbnail">
            <img loading="lazy" data="/static/thumbnail_post/post_{article.id}.jpeg" onerror="this.style.display='none'" alt="" style='width: 100%;border-top-left-radius: 20px;
            border-top-right-radius: 20px;'>
        </div>
        {/if}
        <div class="content-post" style="padding:0.8rem;">
                <div class="info" style="display:flex;">
                        <h1 style="margin-top: 0;font-weight: 400;font-size: 2rem;">{article.title}</h1>
                    </div>
                    <div class="post-author">
                        <img style="border-radius:50px;margin-right: 5px;" height="40px" width="40px" onerror="this.style.display='none'"
                            data="{article.author.avatar}" alt="{article.author.name}">
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
                        {#if article.closed == false}
                        <span style="cursor: pointer;margin-right:0.5rem;" on:click|preventDefault={Comment}><i id="comment"
                                class="na-comment"></i>
                            <span>Comment</span>
                        </span>
                        {/if}
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
                        {#if editing == false}
                        <button class="reply-button" on:click={Reply} style="margin-inline-start:auto;">Post Reply</button>
                        {:else}
                        <button class="reply-button" on:click={Cancel_Reply}>Cancel Edit</button>
                        <button class="reply-button" on:click={C_Edit_Reply} style="margin-inline-start:auto;">Edit Reply</button>
                        {/if}
                        </div>
                    </div>
                    {:else}
                    <div class="card" style="padding: 0.5rem;
                    text-align: center;
                    margin-top: 1rem;">
                        <div class="card-body">
                            <p><i class="na-lock"></i> Post closed by {article.closed_by} on {article.closed_on}</p>
                        </div>
                    </div>
                    {/if}
        </div>
        
        
    </div>
    {#each article.replies as reply}
    <div class="reply" id="reply_{reply.id}">
        <div id="reply_img_{reply.author.id}" class="author" style="
            border-radius: 8px;
            padding: 0.5rem;
            display: flex;">
            <img style="border-radius:20px;margin-right: 5px;" onerror="this.style.display='none'" height="35px" width="35px"
                data="{reply.author.avatar}" alt="{reply.author.name}">
            <div id="reply_name_{reply.author.id}" style="margin-top:-0.1rem;">

                <a id="reply_name" style="font-size: 0.8rem;" href="/user/{reply.author.name}">@{reply.author.name}</a>
                <p style="font-size: 60%;opacity: 0.6;margin-bottom: 0;margin-top: 0;">
                    { reply.author.status }
                </p>
            </div>
        </div>

        {@html reply.text}

        <br>
        <div class="info" style="display: flex">
            <div  style="margin-inline-start: auto;display:flex;">
                {#if $session.auth}
                <div class="reply-actions">
                {#if $session.id == reply.author.id || $session.permissions.edit_reply_permission == true}
                    <button class="edit" on:click={()=>{Edit_Reply(reply)}}>Edit</button>
                {/if}
                {#if $session.id == reply.author.id || $session.permissions.delete_reply_permission == true}
                    <button class="delete" on:click={()=>{Delete_Reply(reply.id)}}>Delete</button>
                {/if}
                </div>
                {/if}
                
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
