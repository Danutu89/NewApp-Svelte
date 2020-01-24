<script>
import axios from 'axios';
import OpenJoin from '../modules/OpenJoin.js';
import { stores } from '@sapper/app';
const { session } = stores();

export let trending;
export let page;
export let author;
export let user;
let follow_button;

function Follow_User(id){
    if($session.auth){
        axios.get('https://newapp.nl/api/follow-user/' + id + '?t=' + $session.token, { progress: false })
        .then(response => {
            if (response.data['operation'] == 'unfollowed') {
                follow_button.innerHTML = 'Follow';
            } else if (response.data['operation'] == 'followed') {
                follow_button.innerHTML = '&#x2713 Following';
            }

        })
    }else{
        OpenJoin();
    }
}

</script>
<div class="sidebar" id="sidebar-right">
{#if page == "index"}
    <div class="widget-posts" id="widget-trending-posts">
        <div class="widget-header">
            <div class="widget-title">Trending Posts 🔥</div>
        </div>
        <div class="widget-list">
        {#each trending as trend}
            <div class="widget-post">
                <div class="post-header">
                    <img style="border-radius: 20px;margin-top: 0.25rem;" src="{trend.author.avatar}" height="40px" width="40px" alt="{trend.author.name}">
                        
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
    <div class="user-card" style="align-items: unset">
        <a rel="prefetch" href="/user/{author.name}"
            style="margin-bottom:0.2rem;display: flex">
        <div class="user-image">
            <img class="profile_image" src="{author.avatar}" height="50px" width="50px" title="profile image" alt="{author.name}">
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
                    <span style="font-size: 0.8rem;"><i class="fal fa-briefcase"></i> Profession: {author.profession}</span>
                </div>
            </div>
            {/if}
            <div class="widget-item">
                <div class="text">
                    <span style="font-size: 0.8rem;"><i class="fal fa-home"></i> Location: {author.country}<span
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
                    <img style="border-radius: 20px;margin-top: 0.25rem;" src="{article.author.avatar}" height="40px" width="40px" alt="{article.author.name}">
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