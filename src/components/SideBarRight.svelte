<script>
import {instance} from '../modules/Requests.js';
import OpenJoin from '../modules/OpenJoin.js';
import OpenRegister from '../modules/OpenRegister.js';
import { stores, goto } from '@sapper/app';
const { session } = stores();

export let trending;
export let page;
export let author;
export let user;
export let article;
let follow_button;

function Follow_User(id){
    if($session.auth == false){
        OpenJoin();
        return;
    }
    instance.get('/api/follow-user/' + id, { progress: false }).then((response) => {
        if (response.status != 200){
            //alert
            return;
        }
        if (response.data['operation'] == 'unfollowed') {
            follow_button.innerHTML = 'Follow';
        } else if (response.data['operation'] == 'followed') {
            follow_button.innerHTML = '&#x2713 Following';
        }

    })
}

function Delete_Post(id){
    if($session.auth == false){
        OpenJoin();
        return;
    }
    instance.get('/api/post/delete/' + id).then((response)=>{
        if (response.status != 200){
            //alert
            return;
        }
        if (response.data['operation'] == 'success'){
            goto('/');
        } else if (response.data['operation'] == 'failed'){
            //alert
            return;
        }
    });
}

function Edit_Post(){
    goto("/post/edit/"+article.link);
}

</script>
<div class="sidebar" id="sidebar-right">
{#if $session.auth == false}
<div class="widget" id="widget-register">
        <div class="logo">
                <img style="vertical-align: middle;margin-left: -1px;" onerror="this.style.display='none'" data="/static/logo.svg" width="80" alt="">
        </div>
        <div class="moto">
            JOIN US
        </div>
        <div class="register">
            <button on:click={OpenRegister}>REGISTER</button>
        </div>
    </div>
{/if}
{#if page == "index"}
    
    <div class="widget-posts" id="widget-trending-posts">
        <div class="widget-header">
            <div class="widget-title">Trending Posts 🔥</div>
        </div>
        <div class="widget-list">
        {#if trending}
            {#each trending as trend}
            <div class="widget-post">
                <div class="post-header">
                    <img style="border-radius: 20px;margin-top: 0.25rem;" onerror="this.style.display='none'" data="{trend.author.avatar}" height="40px" width="40px" alt="{trend.author.name}">
                        
                    </div>
                <div class="post-footer" style="margin-left: 2%;">
                    <div class="post-title">
                        <a rel="prefetch" href="/post/{trend.link}">
                                <span class="post-title">{trend.title}</span>
                            </a>
                    </div>
                    <div class="post-tags">
                    {#each trend.tags as tag}

                        <a href="/tag/{tag}" style="margin-right: 0.1rem;"><tag class="article-tag">{tag}</tag>
                        </a>

                        {/each}
                    </div>
                </div>
            </div>
            {/each}
        {:else}
            {#each Array(6) as x}
                <div class="widget-post">
                <div class="post-header">
                    <div class="loading" style="height: 40px;width: 40px;border-radius: 40px;"></div>
                        
                    </div>
                <div class="post-footer" style="margin-left: 2%;">
                    <div class="post-title loading" style="width: 12rem;height: 1.1rem;margin-bottom: 0.5rem;">
                    </div>
                    <div class="post-tags loading" style="width: 4rem;height: 0.8rem;">
                    </div>
                </div>
            </div>
            {/each}
        {/if}
        </div>
    </div>
    
{:else if page == "post"}
<style>
content .sidebar#sidebar-right{
    position: -webkit-sticky;
    position: sticky;
    top: 3.5rem;
    align-self: flex-start;
  }
</style>
    {#if $session.auth && $session.permissions.edit_post_permission }
        <div class="widget">
        <div class="widget-header">
            <div class="widget-title">Post Actions</div>
        </div>
        <div class="widget-list">
            {#if $session.permissions.close_post_permission }
            {#if article.closed == false }
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                <div class="text">Close Post</div>
                <button class="widget-button">Close</button>
            </div>
            {/if }
            {/if }
            {#if $session.permissions.delete_post_permission }
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                <div class="text">Delete Post</div>
                <button on:click={()=>{Delete_Post(article.id)}} class="widget-button">Delete</button>
            </div>
            {/if } 
            {#if $session.permissions.edit_post_permission || $session.id == article.author.id }
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                    <div class="text" style="display:flex;white-space: nowrap;">Edit Post</div>
                    <button on:click={Edit_Post} class="widget-button">Edit</button>
                </div>
            {/if }
        </div>
    </div>
    {/if}
    <div class="user-card" style="align-items: unset">
        <a rel="prefetch" href="/user/{author.name}"
            style="margin-bottom:0.2rem;display: flex">
        <div class="user-image">
            <img class="profile_image" data="{author.avatar}" onerror="this.style.display='none'" height="50px" width="50px" title="profile image" alt="{author.name}">
        </div>
        
            <div class="user-info">
                <span style="display: flex;height:0.92em;">{author.real_name}<span
                        class="dot_status"style="margin-left: 2%;height: 10px;width: 10px;margin-right: 0;margin-top: 4px;background-color:{author.status_color};"></span></span>
                <span class="user-tag">@{author.name}</span>
            </div>
        </a>
            <div class="profile-actions">
                {#if $session.auth}                                         
                    {#if author.id == $session.id}
                    <a href="/user/{$session.name}"><button class="follow-user"
                        id="follow-user-{author.id}">Profile</button></a>
                    {:else}
                        {#if user.following}
                        <button bind:this={follow_button} on:click|preventDefault={() => Follow_User(author.id)} class="follow-user"
                            id="follow-user-{author.id}">&#x2713 Following</button>
                        {:else}
                        <button bind:this={follow_button} on:click|preventDefault={() => Follow_User(author.id)} class="follow-user"
                            id="follow-user-{author.id}">Follow</button>
                        {/if}
                    {/if}                   
                {:else}
                <button class="follow-user" id="follow-user-{author.id}" on:click|preventDefault={() => Follow_User(author.id)}>Follow</button>
                {/if}
            </div>
        
    </div>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-">@{author.name} info:</div>
        </div>
        <div class="widget-list">
            {#if author.profession != "None" && author.profession}
            <div class="widget-item">
                <div class="text">
                    <span style="font-size: 0.8rem;"><i class="na-briefcase"></i> Profession: {author.profession}</span>
                </div>
            </div>
            {/if}
            <div class="widget-item">
                <div class="text">
                    <span style="font-size: 0.8rem;"><i class="na-home"></i> Location: {author.country}<span
                            class="flag-icon flag-icon-{author.country_flag}"></span></span>
                </div>
            </div>
            <div class="widget-item">
                <div class="text">
                    <span style="font-size: 0.8rem;"><i class="na-clock"></i> Joined on: {author.joined_on}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="widget-posts">
        <div class="widget-header" style="border:none;">
            <div class="widget-title">More From @{author.name}</div>
        </div>
        <div class="widget-list" style="max-height: 550px;/* overflow: auto; */">
            {#each author.posts as article}
            <div class="widget-post">
                <div class="post-header">
                    <img style="border-radius: 20px;margin-top: 0.25rem;" onerror="this.style.display='none'" data="{article.author.avatar}" height="40px" width="40px" alt="{article.author.name}">
                    </div>
                <div class="post-footer" style="margin-left: 2%;">
                    <div class="post-title">
                        <a rel="prefetch" href="/post/{article.link}">
                                <span class="post-title">{article.title}</span>
                            </a>
                    </div>
                    <div class="post-tags">
                    {#each article.tags as tag}

                        <a href="/?tag_finder=python"><tag class="article-tag">{tag}</tag>
                        </a>

                    {/each}
                    </div>
                </div>
            </div>
            {/each}
        </div>
    </div>
{/if}
</div>