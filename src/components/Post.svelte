
<script>

export let article;
import { onMount, beforeUpdate, onDestroy } from 'svelte';
import OpenJoin from '../modules/OpenJoin.js';
import { host } from '../modules/Options.js';
import {instance} from '../modules/Requests.js';
import { swipeDirection } from '../modules/Swipe.js';
import TurndownService from 'turndown';
import marked from 'marked';
import { stores } from '@sapper/app';
const { page, session } = stores();

let like_button;
let reply_likes = [];
let like_counter;
let editor, editor_s;
let isMobile;
let turndown = TurndownService();
let reply_id = -1;
let options_list, share_btn, optionsBtn, share_list;

let document_;

let editing=false;
let editing_id;

let webview = false;

let overflow;

let dark_theme;

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
let touchstartEl = null;

let saveButton, copyButton;

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

function likePostAnim(){
    if(like_button.classList.contains("na-heart1")){
        var likes = parseInt(like_counter.innerHTML);
        var total = likes - 1;
        like_counter.innerHTML = total;
        like_button.classList.remove('na-heart1');
        like_button.classList.add('na-heart');
        like_button.classList.add('heartscale');
    }else if(like_button.classList.contains("na-heart")){
        var likes = parseInt(like_counter.innerHTML);
        var total = likes + 1;
        like_counter.innerHTML = total;
        like_button.classList.remove('na-heart');
        like_button.classList.add('na-heart1');
        like_button.classList.remove('heartscale');
    }
}

function Like_Post() {
    if($session.auth == false){
        OpenJoin();
        return;
    }
    likePostAnim();
    instance.get('/api/like-post/' + article.id, {progress: false})
        .then(response => {
            if(response.status != 200){
                likePostAnim();
            }
            if(response.data['operation'] == 'failed'){
                likePostAnim();
            }
        })
}

function likeReplyAnim(){
    if(reply_likes[id].classList.contains("na-heart")){
        reply_likes[id].classList.remove('na-heart');
        reply_likes[id].classList.add('na-heart1');
        reply_likes[id].classList.remove('heartscale');
    }else if(reply_likes[id].classList.contains("na-heart1")){
        reply_likes[id].classList.remove('na-heart1');
        reply_likes[id].classList.add('na-heart');
        reply_likes[id].classList.add('heartscale');
    }
}

function Like_Reply(id) {
    if($session.auth == false){
        OpenJoin();
        return;
    }
    likeReplyAnim();
    instance.get('/api/like-post/' + article.id, {progress: false})
        .then(response => {
            if(response.status != 200){
                likeReplyAnim();
            }
            if(response.data['operation'] == 'failed'){
                likeReplyAnim();
            }
        })
}

async function Reply(type){
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
    let payload;
    if (type == 'post'){
        payload = {content: markdown, token: $session.token, post_id: article.id, type: 'post'};
        
    }else{
        payload = { content: markdown, token: $session.token, post_id: article.id, type: 'reply', reply_id: reply_id };
    }
    let json = await instance.post('/api/newreply',  payload).then((response) =>{
        return response;
    });
    
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

function Comment(_reply_id,reply_author){
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
    if (_reply_id != -1 && typeof(_reply_id) != "undefined"){
        reply_id = _reply_id;
        editor.value("@"+reply_author);
    }
    
}

async function Delete_Reply(id){
    if($session.auth == false){
        return;
    }
    const not = await instance.get("/api/reply/delete?id="+id).then(response =>{
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
    const resp = await instance.post("/api/reply/edit?id="+editing_id.id,{content: marked(editor.value()), r_id: editing_id.id, token: $session.token}).then(response =>{
        if(response.status != 200){
            //alert
            return;
        }

        if(response.data['operation'] != "success"){
            //alert
            return;
        }

        var data = response.data['reply'];

        let replies = article.replies;
        replies.forEach(reply => {
            if(reply.id == editing_id.id){
                reply.text_e = data['content'];
                reply.text = data['content'];
                data['mentions'].forEach(mention => {
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

function onClickDocument(e){
    if(!copyButton || !share_btn || !options_list || !optionsBtn)
        return;

    if(!copyButton.contains(e.target)){
        copyButton.innerHTML = copyButton.childNodes[0].outerHTML+' Copy Link';
        copyButton.childNodes[0].classList.remove("scale-anim");
    }
    if(isMobile){
        if(share_btn.contains(e.target)){
            if(options_list.classList.contains("toggled")){
                if(options_list.classList.contains("share")){
                    options_list.classList.remove("toggled");
                    options_list.classList.remove("share");
                }else{
                    options_list.classList.add("share");
                }
                
            }else{
                options_list.classList.add("toggled");
                options_list.classList.add("share");
            }
        }
        else if(optionsBtn.contains(e.target)){
            if(options_list.classList.contains("toggled")){
                if(options_list.classList.contains("share")){
                    options_list.classList.remove("share");
                }else
                    options_list.classList.remove("toggled");
            }else{
                options_list.classList.add("toggled");
            }
        }else if(!share_btn.contains(e.target) && !options_list.contains(e.target)){
            options_list.classList.remove("toggled");
            options_list.classList.remove("share");
        }
    }else{
        if(share_btn.contains(e.target)){
            if(share_list.classList.contains("toggled")){
                share_list.classList.remove("toggled");
                
            }else{
                share_list.classList.add("toggled");
            }
        }else if(!share_list.contains(e.target) && !share_list.contains(e.target)){
            share_list.classList.remove("toggled");
        }
    }
}

function TouchStart(event){
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
    touchstartEl = event.targetTouches[0].target;
}

function TouchEnd(event){
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    if($swipeDirection == "none")
        handleGesture(event);
}

function handleGesture(event){
    var h = window.innerHeight;
    if (touchstartY - 20 > touchendY && touchstartX - touchendX < 20 && touchendX - touchstartX < 20 && touchstartY != touchendY){
        swipeDirection.set("up");
        if(touchstartY - h > -20){
            options_list.classList.add("toggled");
            swipeDirection.set("none");
        }
    }
    if (touchstartY + 20 < touchendY && touchstartX - touchendX < 20 && touchendX - touchstartX < 20 && touchstartY != touchendY){
        swipeDirection.set("down")
        if(options_list.contains(touchstartEl)){
            options_list.classList.remove("toggled");
            swipeDirection.set("none");
        }
    }

}

function savePost(){
    if ($session.auth == false){
        OpenJoin();
        return;
    }
    instance.get('/api/save-post/' + article.id, { progress: false }).then(response=>{
        if(response.data['operation'] == 'saved'){
            saveButton.innerHTML = saveButton.childNodes[0].outerHTML+' Saved';
            saveButton.childNodes[0].classList.add("scale-anim");
        }else if(response.data['operation'] == 'deleted'){
            saveButton.innerHTML = saveButton.childNodes[0].outerHTML+' Save';
            saveButton.childNodes[0].classList.remove("scale-anim");
        }
        document.activeElement = null;
    })


}

async function copyLink(){
    if(!navigator.clipboard)
        return;
    await navigator.clipboard.writeText(location.href);
    copyButton.innerHTML = copyButton.childNodes[0].outerHTML+' Copied';
    copyButton.childNodes[0].classList.add("scale-anim");
    document.activeElement = null;
}


onMount(async function(){
    document_ = document;
    var ua = navigator.userAgent;
    if (ua.includes('wv') && $session.auth == false) {
        OpenJoin();
        webview = true;
    } else {
        webview = false;
    }

    isMobile = window.matchMedia("only screen and (max-width: 940px)").matches;
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
    document.addEventListener('click', onClickDocument, {
        capture: true
    });
    overflow = document.querySelector("overflow");
    document.addEventListener('touchstart', TouchStart, false);
    document.addEventListener('touchend', TouchEnd, false); 
})

onDestroy(()=>{
    if(document_){
        document_.removeEventListener('touchstart', TouchStart, false);
        document_.removeEventListener('touchend', TouchEnd, false);
    }
});

</script>

{#if article}
<div class="article">
    <div class="post">
        {#if article.thumbnail}
        <div class="thumbnail">
            <img loading="lazy" data="/static/thumbnail_post/post_{article.id}.jpeg" onerror="this.style.display='none'" alt="" style='width: 100%;border-top-left-radius: var(--border-radius);
            border-top-right-radius: var(--border-radius);'>
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
                        <span style="cursor: pointer;margin-right:0.5rem;" on:click|preventDefault={()=>{Comment(-1)}}><i id="comment"
                                class="na-comment"></i>
                            <span>Comment</span>
                        </span>
                        {/if}
                        <span style="cursor: pointer;" bind:this={share_btn}><i class="na-share"></i> <span>Share</span></span>
                        <!--TODO Fix user post options-->
                        <div class="post-share" style="left:10.5rem;" bind:this={share_list}>
                            <div class="list">
                                <div class="title">Share</div>
                                <hr>
                                <div class="item"><i class="na-facebook-square"></i> Facebook</div>
                                <div class="item"><i class="na-twitter"></i> Twitter</div>
                                <div class="item"><i class="na-globe"></i> Hacker News</div>
                            </div>
                        </div>
                        <div class="post-options" bind:this={options_list}>
                            <div class="lists">
                                <div class="list">
                                    <div class="title">Options</div>
                                    <hr>
                                    <div class="item" on:click|preventDefault={()=>{options_list.classList.add("share")}}><i class="na-share"></i> Share</div>
                                    <div class="item" on:click|preventDefault={savePost} bind:this={saveButton}><i class="na-inbox-in"></i> Save</div>
                                    <div class="item" on:click|preventDefault={copyLink} bind:this={copyButton}><i class="na-edit"></i> Copy Link</div>
                                </div>
                                <div class="list" style="margin-left:1rem">
                                    <div class="title"><i class="na-chevron-left" style="margin-right: 1rem;" on:click|preventDefault={()=>{options_list.classList.remove("share")}}></i>Share</div>
                                    <hr>
                                    <div class="item"><i class="na-facebook-square"></i> Facebook</div>
                                    <div class="item"><i class="na-twitter"></i> Twitter</div>
                                    <div class="item"><i class="na-globe"></i> Hacker News</div>
                                </div>
                            </div>
                        </div>
                        <span style="cursor: pointer;margin-right:0.5rem;" class="mobile-post-options" bind:this={optionsBtn}>
                            <i class="na-cog"></i>
                            <span>Options</span>
                        </span>
                    </div>
                    <div class="user-actions-info">
                        <span><span id="hearts" bind:this={like_counter}>{article.likes}</span> Likes</span>
                    </div>
                    {#if article.closed == false}
                    <div class="post-reply" style="margin-top:3%;display:none;">
                        <textarea class="editor" id="editor" style="margin-bottom:1%;" minlength="0"  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
                        <div style="display:flex;">
                        {#if editing == false}
                            {#if reply_id != -1}
                            <button class="reply-button" on:click={()=>{reply_id=-1,editor.value("");}}>Cancel Reply</button>
                            <button class="reply-button" on:click={()=>{Reply('reply')}} style="margin-inline-start:auto;">Post Reply</button>
                            {:else}
                            <button class="reply-button" on:click={()=>{Reply('post')}} style="margin-inline-start:auto;">Post Reply</button>
                            {/if}
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
            <div class="user-actions">
                <span style="cursor: pointer;margin-right:0.5rem;vertical-align: sub;" on:click|preventDefault={() => {Like_Reply(reply.id)}} bind:this={reply_likes[reply.id]}><i id="heart"
                        class="na-heart"></i>
                    <span>Like</span></span>
                <span style="cursor: pointer;vertical-align: sub;" on:click|preventDefault={() => {Comment(reply.id,reply.author.name)}}><i id="reply"
                        class="na-comment"></i>
                    <span>Reply</span>
                </span>
            </div>
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
