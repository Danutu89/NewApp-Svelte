<script>
import Posts from './Posts.svelte';
import { stores } from '@sapper/app';
import {instance} from '../modules/Requests.js';

import OpenJoin from '../modules/OpenJoin.js';
const { session } = stores();
export let user;

let follow_button;

function Follow_User(id){
    if($session.auth){
        if($session.id != id){
            instance.get('/api/follow-user/' + id)
            .then(response => {
                if (response.data['operation'] == 'unfollowed') {
                    follow_button.innerHTML = 'Follow';
                } else if (response.data['operation'] == 'followed') {
                    follow_button.innerHTML = '&#x2713 Following';
                }

            })
        }
    }else{
      OpenJoin();
    }
}

</script>

<profile class="profile-page">
    {#if user.cover}
    <div class="profile-cover" style="background-image: url({user.cover});background-position: center;background-size: cover;border: var(--border);height:450px;"></div>
    {:else}
    <div class="profile-cover" style="background-color: #14947b;border: var(--border);height:350px;"></div>
    {/if}
    <div class="profile-main">
      <div class="sidebar-info">
        <div class="profile-image" >
          <div><div class="profile-photo" style="background-image: url({user.avatar});background-position: center center;
            background-size: cover;
            border: var(--border);
            height: 200px;
            width: 200px;
            border-radius: 100px;
            border: 3px solid var(--background);
                left: 0;
    right: 0;
    margin: auto;">
          </div></div>

          <div class="user-name" style="line-height: 1.7rem;">
            <h1 style="font-weight: 400;">{user.real_name}</h1>
            <h4 style="font-weight: 400;">@{user.name}</h4>
          </div>
        </div>
        <div class="profile-actions">
          {#if $session.auth}
          {#if $session.id == user.id}
          <a href="/user/settings"><button class="follow-user" id="settings-user-{user.id}">Settings</button></a>
          {:else}
          <button class="follow-user" bind:this={follow_button} on:click={()=>Follow_User(user.id)} id="follow-user-{user.id}">{#if user.info['following']}&#x2713 Following{:else}Follow{/if}</button>
          {/if}
          {:else}
          <button class="follow-user" bind:this={follow_button} on:click={()=>Follow_User(user.id)} id="follow-user-{user.id}">Follow</button>
          {/if}
          
        </div>
        <div class="widgets">
          <div class="profile-presentation">
            <div class="header"><i class="na-globe"></i> Presentation</div>
            <div class="bio">{user.bio}</div>
            <div class="info">
              {#if user.profession != 'None' && user.profession }
              <p><i class="na-briefcase"></i> Profession {user.profession}</p>
              {/if}
              <p><i class="na-home"></i> From {user.country_name} <span class="flag-icon flag-icon-{user.country_flag}"></span></p>
              <p><i class="na-clock"></i> Joined on {user.join_date}</p>
              <p><i class="na-rss"></i> Followed by {user.followed_count} people</p>
            </div>
          </div>
          {#if user.tags_check}
          <div class="interesed-tags">
            <div class="header"><i class="na-hashtag"></i> Interesed Tags</div>
            <div class="tags">
              {#each user.tags as tag}
                    <a style="text-decoration: none;" title="{tag}" href="/tag/{tag}"><span
                        style="font-size: 12px;">{tag}</span></a>
                        <br>
                    {/each}
            </div>
          </div>
          {/if}
          {#if user.social }
          <div class="social">
            <div class="header"><i class="na-users"></i> Social</div>
            <div class="links">
              {#if user.facebook }
              <div style="margin-bottom: 0.3rem">
              <a style="text-decoration: none;"  href="https://facebook.com/{user.facebook}"><span
                style="font-size: 0.85rem;"><i class="na-facebook-square" style="font-size: 1rem;"></i> @{user.facebook}</span></a>
              </div>
              {/if}
              {#if user.instagram }
              <div style="margin-bottom: 0.3rem">
              <a style="text-decoration: none;" href="https://instagram.com/{user.instagram}"><span
                style="font-size: 0.85rem;"><i class="na-instagram" style="font-size: 1rem;"></i> @{user.instagram}</span></a>
              </div>
              {/if}
              {#if user.twitter }
              <div style="margin-bottom: 0.3rem">
              <a style="text-decoration: none;" href="https://twitter.com/{user.twitter}"><span
                style="font-size: 0.85rem;"><i class="na-twitter" style="font-size: 1rem;"></i> @{user.twitter}</span></a>
              </div>
              {/if}
              {#if user.github }
              <div style="margin-bottom: 0.3rem">
              <a style="text-decoration: none;" href="https://github.com/{user.github}"><span
                style="font-size: 0.85rem;"><i class="na-github" style="font-size: 1rem;"></i> @{user.github}</span></a>
              </div>
              {/if}
              {#if user.website }
              <div style="margin-bottom: 0.3rem">
                  <a style="text-decoration: none;" href="{user.website}"><span
                    style="font-size: 0.85rem;"><i class="na-globe" style="font-size: 1rem;"></i> {user.website}</span></a>
                    
              </div>
              {/if}
            </div>
          </div>
          {/if}
        </div>
      </div>
      <div class="sidebar-main">
        <div class="statistics">
          <div class="stat-item">
              <i class="na-pen-square" style="font-size: 1rem;"></i> {user.post_count} Posts
          </div>
          <div class="stat-item">
              <i class="na-tachometer" style="font-size: 1rem;"></i> {user.post_views} Posts Views
          </div>
          <div class="stat-item">
              <i class="na-comments" style="font-size: 1rem;"></i> {user.reply_count} Replies
          </div>
        </div>
        <div class="user-posts">
            <Posts data={user.posts} user={user.id} mode={"user"}/>
        </div>
      </div>
      <div class="sidebar-right">
        {#if user.follow_check}
        <div class="widgets">
          <div class="user-follows">
            <div class="header">{user.real_name} Follows</div>
            <hr>
            <div class="users">
              {#each user.follows as userf}
              <div class="user-followed" id="user-1">
                  <div class="user-img"><img loading="lazy" data="{userf.avatar}" onerror="this.style.display='none'" alt=""></div>
                  <a href="/user/{userf.name}">
                  <div class="user-info">
                    <span>{userf.real_name}</span>
                    <br>
                    <span style="font-size: 0.7rem;">@{userf.name}</span>
                  </div>
                  </a>
              </div>
              {/each}
            </div>
          </div>
        </div>
        {/if}
      </div>
    </div>
  </profile>