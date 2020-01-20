
<script>

export let article;
import SideBarRight from '../components/SideBarRight.svelte';
import { onMount } from 'svelte';
import axios from 'axios';
import imageHandler from '../modules/ImageHandler.js'
import { stores } from '@sapper/app';
const { session } = stores();

let like_button;
let like_counter;
let editor,editor_sett;

function Like_Post() {
    axios.get('https://newapp.nl/api/like-post/' + article.id +'?t=' + $session.token, {progress: false})
        .then(response => {
            like_button.classList.toggle('na-heart1');
            like_button.classList.toggle('na-heart');

            if (response.data['operation'] == 'unliked') {
                var likes = parseInt(like_counter.innerHTML);
                var total = likes - 1;
                like_counter.innerHTML = total;
            } else if (response.data['operation'] == 'liked') {
                var likes = parseInt(like_counter.innerHTML);
                var total = likes + 1;
                like_counter.innerHTML = total;
            }

        })
}

onMount(async function(){
    var toolbarOptions = [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{
          'header': [1, 2, 3, 4, 5, 6, false]
      }],
      [{
          'color': []
      }, {
          'background': []
      }],
      [{
          'font': []
      }],
      [{
          'align': []
      }],
      ['emoji'],
    ];
    let quill = require('quill');
    editor_sett = new quill(editor, {
            modules: {
                toolbar: {
                  container: toolbarOptions,
                  handlers: {
                      image: imageHandler
                  }
                }
            },
            theme: 'snow',
        });
})

</script>

<svelte:head>
<title>{article.title}</title>
</svelte:head>

{#if article}
<div class="article">
    <div class="post">
        {#if article.thumbnail}
        <div class="thumbnail">
            <img loading="lazy" src="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg" alt="" style='width: 100%;border-top-left-radius: 5px;
            border-top-right-radius: 5px;'>
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
                    <div class="post_content">
                        {@html article.text}
                    </div>
                    <br>
                    
                    <div class="user-actions">
                        {#if $session.auth}
                        {#if article.user['liked']}
                        <span style="cursor: pointer;margin-right:0.5rem;"><i id="heart"
                                class="na-heart" bind:this={like_button} on:click|preventDefault={Like_Post}></i>
                            Like</span>
                        {:else}
                        <span style="cursor: pointer;margin-right:0.5rem;"><i id="heart"
                                class="na-heart1" bind:this={like_button} on:click|preventDefault={Like_Post}></i>
                            Like</span>
                        {/if}
                        {:else}
                        <span style="cursor: pointer;margin-right:0.5rem;"><i id="heart"
                                class="na-heart1" bind:this={like_button}></i>
                            Like</span>
                        {/if}
                        <span id="share" style="cursor: pointer;"><i class="na-share"></i> Share</span>
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
                        <form class="form-thread" id="reply" role="form" method="post"
                            action="">
                            <div class="editor" bind:this={editor} id="editor" style="margin-bottom:1%;" minlength="0"  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>
                            <div style="display:flex;">
                            <button class="reply-button" type="submit" style="margin-inline-start:auto;">Post Reply</button>
                            </div>
                        </form>
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
                    border-radius: 5px;
                    padding: 0.5rem;
                    background-color: rgb(239, 240, 241);
                    display: flex;">
                    <img style="border-radius:20px;margin-right: 5px;" height="35px" width="35px"
                        src="{reply.author.avatar}" alt="{reply.author.name}">
                    <div id="reply_name_{reply.author.id}" style="margin-top:-0.1rem;">
    
                        <a id="reply_name" style="color: #333;font-size: 1rem;"
                            href="/user/{reply.author.name}">@{reply.author.name}</a>
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
        or <a href="/newpost" style="color:#18BC9C;"> ask your own question</a>.</p>
</div>
{/if}

<SideBarRight author={article.author} user={article.user} page={"post"}/>