<script>
import {instance} from '../modules/Requests.js';
import { wrapper } from '../modules/Variables.js';
import { onMount, onDestroy } from 'svelte';
import OpenJoin from '../modules/OpenJoin.js';
import { host } from '../modules/Options.js';
import { stores } from '@sapper/app';
import { swipeDirection } from '../modules/Swipe.js';
const { session } = stores();
const wrapper_ = wrapper;

export let user;
export let utilities;
let tag_button = [];
let isMobile;

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

let top, height, winHeight;

let document_;
let window_;


function Follow_Tag(tag_) {
    if($session.auth == false){
        OpenJoin();
        return;
    }
    instance.get('/api/follow-tag/' + tag_, { progress: false })
        .then(function (response){
            var x = tag_button[tag_];
            tag_button[tag_] = x;

            if (response.staus != 200){
                //alert
                return;
            }

            if (response.data['operation'] == 'followed') {
                x.innerHTML = 'Unfollow';
                utilities.tags.splice( utilities.tags.indexOf(tag_), 1 );
                utilities.tags = [...utilities.tags];
                user.flw_tags = [...user.flw_tags,tag_];
            } else if (response.data['operation']  == 'unfollowed') {
                x.innerHTML = 'Follow';
                user.flw_tags.splice( user.flw_tags.indexOf(tag_), 1 );
                user.flw_tags = [...user.flw_tags];
                utilities.tags = [...utilities.tags, tag_]
            }
    })
}

function TouchStart(event){
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}

function TouchEnd(event){
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    if ($swipeDirection == "none")
        handleGesture(event);
}

function onScreenChange(){
    isMobile = window.matchMedia("only screen and (max-width: 1260px)").matches;
    if (isMobile === true){
        document.getElementById("sidebar-left").classList.add('wrapper-left');
        document.getElementById("sidebar-left").classList.remove('sidebar');
    }else{
        document.getElementById("sidebar-left").classList.remove('wrapper-left');
        document.getElementById("sidebar-left").classList.add('sidebar');
    }
}

onMount(async function(){
    isMobile = window.matchMedia("only screen and (max-width: 1260px)").matches;
    window.addEventListener('resize', onScreenChange);
    window_ = window;
    if (isMobile === true){
        document.getElementById("sidebar-left").classList.add('wrapper-left');
        document.getElementById("sidebar-left").classList.remove('sidebar');
    }else{
        document.getElementById("sidebar-left").classList.remove('wrapper-left');
        document.getElementById("sidebar-left").classList.add('sidebar');
    }
    top = document.getElementById("sidebar-left").offsetTop;
    height = document.getElementById("sidebar-left").offsetHeight;
    winHeight = window.innerHeight;
    //document.addEventListener('touchstart', TouchStart, false);

    //document.addEventListener('touchend', TouchEnd, false); 
    document_ = document;
})

onDestroy(function(){
    if(document_ && window_){
        //document_.removeEventListener('touchstart', TouchStart, false);
        //document_.removeEventListener('touchend', TouchEnd, false); 
        window_.removeEventListener('resize', onScreenChange);
        try {
            wrapper_.setTrue(document_.getElementById("sidebar-left"),document_.querySelector("overflow"),document_.querySelector(".newapp-navbar"));   
        } catch (error) {
        
        }
    }
})

function handleGesture(event) {
    //Right Swipe
    if (touchendX - 10 < touchstartX && touchendY - touchstartY < 20 && touchstartY - touchendY < 20 && touchendX != touchstartX) {
        swipeDirection.set("right");
        if (!wrapper_.opened){
            wrapper_.setTrue(document.getElementById("sidebar-left"),document.querySelector("overflow"),document.querySelector(".newapp-navbar"));
            swipeDirection.set("none");
        }
    }
    //Left Swipe
    if (touchendX - 10 > touchstartX && touchstartY - touchendY < 20 && touchendY - touchstartY < 20 && touchendX != touchstartX) {
        swipeDirection.set("left");
        if (wrapper_.opened){
            wrapper_.setFalse(document.getElementById("sidebar-left"),document.querySelector("overflow"),document.querySelector(".newapp-navbar"));
            swipeDirection.set("none");
        }
    }

    if(touchendX == touchstartX && touchstartY == touchendY && !document.getElementById("sidebar-left").contains(event.target)){
        if (!wrapper_.opened){
            wrapper_.setTrue(document.getElementById("sidebar-left"),document.querySelector("overflow"),document.querySelector(".newapp-navbar"));
        }
    }

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
    <div class="user-image">
        <img class="profile_image" alt="" data="{$session.avatar}" onerror="this.style.display='none'" height="50px" width="50px" title="profile image">
    </div>
    <div class="user-info" style="margin-top: -0.2rem;">
        <div style="font-size:1.1rem;">{$session.real_name}</div>
        <div class="user-tag" style="font-size: 0.7rem;">@{$session.name}</div>
    </div>
    </a>
</div>
{/if}
<div class="widget" id="navigation">
    <div class="widget-header">
        <div class="widget-title">Navigation</div>
    </div>
    <div class="widget-list">
        <div class="widget-item" id='posts-show'>
            <div class="text"><a href="/"><span class="section"><i class="na-pen-square"></i> Posts</span></a></div>
        </div>
        <div class="widget-item" id='podcasts-show'>
            <div class="text"><a href="/podcasts"><span class="section"><i class="na-headphones"></i> Podcasts</span></a></div>
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
        <div class="widget-item" style="border-top: none;display: flex;background-color: var(--background-1);">
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
    <a href="https://newapp.nl"><img style="vertical-align: middle;margin-left: -1px;" onerror="this.style.display='none'" data="/static/logo.svg"
            width="25" height="30" alt=""></a>
    <a href="https://www.facebook.com/newapp.nl"><i class="na-facebook-square" style="font-size: 2rem;
        color: var(--theme-color);
        vertical-align: middle;
        margin-left: 0.5rem;"></i></a>
    <a href="https://twitter.com/_NewApp_"><i class="na-twitter" style="font-size: 2rem;
        color: var(--theme-color);
        vertical-align: middle;
        margin-left: 0.5rem;"></i></a>
    <a href="/about" style="display: block;margin-top: 0.5rem;">About</a>
    <a href="/contact" style="display: block;margin-top: 0.5rem;">Contact</a>
    <a href="/privacy" style="display: block;margin-top: 0.5rem;">Privacy</a>
</div>

</div>