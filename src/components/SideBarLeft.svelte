<script>
import axios from 'axios';
import { stores } from '@sapper/app';
const { session } = stores();

export let user;
export let utilities;
let tag_button = [];

function Follow_Tag(tag_) {
    axios.get('https://newapp.nl/api/follow-tag/' + tag_ + '?t=' + $session.token, { progress: false })
        .then(function (response){
            var x = tag_button[tag_];
            tag_button[tag_] = x;
            if (response.data['operation'] == 'followed') {
                x.innerHTML = 'Unfollow';
                utilities.tags.splice( utilities.tags.indexOf(tag_), 1 );
                user.flw_tags = [...user.flw_tags,tag_];
            } else if (response.data['operation']  == 'unfollowed') {
                x.innerHTML = 'Follow';
                user.flw_tags.splice( user.flw_tags.indexOf(tag_), 1 );
                utilities.tags = [...utilities.tags, tag_]
            }
        })
}


</script>

<div class="sidebar" id="sidebar-left">
<div class="widget" id="pwa">
    <div class="widget-list">
        <div class="widget-item" style="display: flex;">
            <div class="text" style="line-height: 1.5;">Install our WebApp</div>
            <button class="widget-button" id="install_pwa" style="margin-inline-start: auto;">Install</button>
        </div>
    </div>
</div>
{#if $session.auth}
<div class="user-card">
    <a href="/user/{$session.name}" style="display: flex;">
    <div class="user-image" style="margin-bottom:0;">
        <img class="profile_image" alt="" src="https://newapp.nl{$session.avatar}" height="50px" width="50px" title="profile image">
    </div>
    <div class="user-info" style="margin-top: -0.2rem;">
        <span>{$session.real_name}</span>
        <br>
        <span class="user-tag">@{$session.name}</span>
    </div>
    </a>
</div>
{/if}
<div class="widget">
    <div class="widget-header">
        <div class="widget-title">Navigation</div>
    </div>
    <div class="widget-list">
        <div class="widget-item" id='posts-show'>
            <div class="text"><a href="/"><span class="section"><i class="na-pen-square"></i> Posts</span></a></div>
            <div class='multilevel' id='posts'>
                <div class="widget-item">
                    <div class="text"><a href="/saved"><span class="section"><span style='color:#18BC9C'>•</span> Saved Posts</span></a></div>
                </div>
                <div class="widget-item">
                    <div class="text"><a href="/"><span class="section"><span style='color:#18BC9C'>•</span> Feed</span></a></div>
                </div>
                <div class="widget-item">
                        <div class="text"><a href="/all"><span class="section"><span style='color:#18BC9C'>•</span> All</span></a></div>
                </div>
                <div class="widget-item">
                        <div class="text"><a href="/questions"><span class="section"><span style='color:#18BC9C'>•</span> Questions</span></a></div>
                </div>
                <div class="widget-item">
                        <div class="text"><a href="/discuss"><span class="section"><span style='color:#18BC9C'>•</span> Discuss</span></a></div>
                </div>
                <div class="widget-item">
                        <div class="text"><a href="/tutorials"><span class="section"><span style='color:#18BC9C'>•</span> Tutorials</span></a></div>
                </div>
            </div>
        </div>
        <div class="widget-item" id='podcasts-show'>
            <div class="text"><a href="/podcasts"><span class="section"><i class="na-headphones"></i> Podcasts</span></a></div>
            <div class='multilevel' id='podcasts'>
                <div class="widget-item">
                    <div class="text"><a href="/podcasts/saved"><span class="section"><span style='color:#18BC9C'>•</span> Saved Podcasts</span></a></div>
                </div>
                <div class="widget-item">
                    <div class="text"><a href="/podcasts"><span class="section"><span style='color:#18BC9C'>•</span> Feed</span></a></div>
                </div>
                <div class="widget-item">
                    <div class="text"><a href="/podcasts/all"><span class="section"><span style='color:#18BC9C'>•</span> All</span></a></div>
                </div>
            </div>
        </div>
    </div>
</div>
{#if utilities}
<div class="widget">
    <div class="widget-header">
        <div class="widget-title">Customize your experience</div>
    </div>
    <div class="widget-list" style="max-height: 400px;overflow: auto;">
        {#if $session.auth}
        {#each user.flw_tags as tag}
        <div class="widget-item" id="widget-tags" style="border-top: none;display: flex;">
            <div class="text">
                <a style="text-decoration: underline;" href="/tag/{tag}">
                    #{tag}
                </a>
            </div>
            <button class="widget-button" bind:this={tag_button[tag]} on:click|preventDefault={() => Follow_Tag(tag)} id="follow-tag-{tag}" style="margin-inline-start: auto;">Unfollow</button>
        </div>
        {/each}
        <div class="widget-item" style="border-top: none;display: flex;background-color: var(--body-bg);">
            <div class="text">
                Other Popular Tags
            </div>
        </div>
        {/if}
        {#each utilities.tags as tag}
        <div class="widget-item" id="widget-tags" style="border-top: none;display: flex;">
            <div class="text">
                <a style="text-decoration: underline;" href="/tag/{tag}">
                    #{tag}
                </a>
            </div>
            <button class="widget-button" bind:this={tag_button[tag]} on:click|preventDefault={() => Follow_Tag(tag)} id="follow-tag-{tag}" style="margin-inline-start: auto;">Follow</button>
        </div>
        {/each}
    </div>
</div>
{/if}
<div class="widget" style="display: block;padding: 1rem;">
    <a href="https://newapp.nl"><img style="vertical-align: middle;margin-left: -1px;" src="https://newapp.nl/static/logo.svg"
            width="25" height="30" alt=""></a>
    <a href="https://www.facebook.com/newapp.nl"><i class="na-facebook-square" style="font-size: 2rem;
        color: #18BC9C;
        vertical-align: middle;
        margin-left: 0.5rem;"></i></a>
    <a href="https://twitter.com/_NewApp_"><i class="na-twitter" style="font-size: 2rem;
        color: #18BC9C;
        vertical-align: middle;
        margin-left: 0.5rem;"></i></a>
    <a href="/about" style="display: block;margin-top: 0.5rem;">About</a>
    <a href="/contact" style="display: block;margin-top: 0.5rem;">Contact</a>
    <a href="/privacy" style="display: block;margin-top: 0.5rem;">Privacy</a>
</div>

</div>