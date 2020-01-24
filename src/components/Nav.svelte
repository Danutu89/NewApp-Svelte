<script>
import Login from './Login.svelte';
import Register from './Register.svelte';
import { onMount, onDestroy  } from 'svelte';
import { stores, goto } from '@sapper/app';
import Cookie from 'cookie-universal';
import Join from '../components/Join.svelte';
import axios from 'axios';
const cookies = Cookie();
const { session, page } = stores();

let l_modal, r_modal, j_modal,l_modal_in, r_modal_in, j_modal_in, user = null, user_center = null, user_image = null, overflow = null, search = "";
var menu_open = false;
let notifications,notifications_c,notifications_center_c;

function logOut(){
  cookies.remove("token");
  location.reload();
}

function onClickDocument(e){
  if($session.auth){
    if(e.target != user_image && e.target != user_center){
      if(user.style["display"] == "block"){
        user.style["display"] = "none";
        overflow.classList.remove("show");
        menu_open = false;
      }
    }else if(e.target == user_image){
      if(user.style["display"] == "none"){
        user.style["display"] = "block";
        overflow.classList.add("show");
        menu_open = true;
      }else if(user.style["display"] == "block"){
        user.style["display"] = "none";
        overflow.classList.remove("show");
        menu_open = false;
      }
    }
  }else{
    if(!l_modal_in.contains(e.target)){
      l_modal.style["visibility"] = "hidden";
      l_modal.style["opacity"] = 0;
      l_modal.style["pointer-events"] = "none";
    }
    if(!r_modal_in.contains(e.target)){
      r_modal.style["visibility"] = "hidden";
      r_modal.style["opacity"] = 0;
      r_modal.style["pointer-events"] = "none";
    }
    if(!j_modal_in.contains(e.target)){
      j_modal.style["visibility"] = "hidden";
      j_modal.style["opacity"] = 0;
      j_modal.style["pointer-events"] = "none";
    }
  }
  if (menu_open === true) {
    return false;
  }
}

onMount(async function(){
  l_modal = document.getElementById("login-modal");
  r_modal = document.getElementById("register-modal");
  j_modal = document.getElementById("join-modal");
  l_modal_in = document.getElementById("login-modal-inner");
  r_modal_in = document.getElementById("register-modal-inner");
  j_modal_in = document.getElementById("join-modal-inner");
  overflow = document.querySelector("overflow");
  document.addEventListener('click', onClickDocument, {
    capture: true
  });

  let not = await axios.get('https://newapp.nl/api/notifications?t='+$session.token).then((response)=>{
    return response.data;
  })
  notifications = await not;

  return () => {
    document.removeEventListener('click', onClickDocument, {
      capture: true
    });
  }

});

function OpenModalLogin(){
  if (l_modal.style["opacity"] < 1){
    l_modal.style["visibility"] = "visible";
    l_modal.style["opacity"] = 1;
    l_modal.style["pointer-events"] = "auto";
  }else{
    l_modal.style["visibility"] = "hidden";
    l_modal.style["opacity"] = 0;
    l_modal.style["pointer-events"] = "none";
  }
}

function Search(){
  goto('/search?q='+search);
}

function handleKeydown(event) {
  if (event.keyCode == 13){
    Search()
  }
}

async function OpenNotifications(){
  if(notifications_center_c.style['display'] == 'block'){
    notifications_center_c.style['display'] = 'none';
    overflow.classList.remove("show");
  }else{
    let not = await axios.get('https://newapp.nl/api/notifications?t='+$session.token).then((response)=>{
      return response.data;
    })
    notifications = await not;  
    overflow.classList.add("show");
    notifications_center_c.style['display'] = 'block';
  }
}

</script>

<nav class="newapp-navbar">
	<div class="navbar-items">
      <div class="navbar-item">
        <a href="/" class="navbar-logo"><img style="vertical-align: middle;margin-left: -1px;" loading="lazy" src="https://newapp.nl/static/logo.svg"
            width="25" alt=""><span style="margin-left: 0.2rem;" class="newapp-title"><span style="color:#18BC9C;">New</span><span
              style="color:var(--navbar-color);">App</span><span style="color:#18BC9C;font-size: 55%;font-weight: 600;">
              Beta</span></span></a>
      </div>
      <div class="navbar-item navbar-center navbar-search">
        <input bind:value={search} type="text" name="q" placeholder="Search" id="search" on:keydown={handleKeydown}>
      </div>
	   <div style="margin-inline-start: auto;display:flex;">
     {#if $session.auth == true}
     <div on:click={OpenNotifications} class="navbar-item">
       <div class="newapp-dropdown" id="notification-center" style="cursor: pointer;">
         <i bind:this={notifications_c} class="na-bell" style="display:block;margin-top: 0.35rem;font-size:1.2rem;
          margin-right: 0.8rem;"></i>
          {#if notifications}
         {#if notifications.count > 0 }
          <span class="notifications-number">{notifications.count}</span>
          {/if}
          <div bind:this={notifications_center_c} class="newapp-dropdown-content" id="notifications" style="min-width: 16rem;margin-inline-start:-15.4rem;margin-top: 0.9rem;">
          Notifications
          <hr>
          {#if notifications.count > 0 }
          {#each notifications.notify as notification}
          {#if notification.checked == false }
            <a href="{notification.link}?notification={notification.id}">
              <div class="dropdown-item" style="display:flex;">
                <img src="{notification.author.avatar}" height="30px" width="30px" style="border-radius: 30px;margin-top: 0.2rem;" alt="">
                <div style="display: block;margin-left: 0.4rem;line-height: 1.2;">
                  <span style="color: var(--navbar-color);font-size:1rem;line-height: 1;"><span style="font-weight: 500;">{notification.title }</span></span>
                  {#if notification.category != 'follow' || notification.category != 'unfollow' }
                  <span style="color: var(--link)">{notification.body}</span>
                  {/if}
                  <span style="color: #828282;
                  width: max-content;
                  display: flex;
                  margin-inline-start: auto;
                  font-size: 0.6rem;margin-top: 0.3rem;">{notification.time_ago} ago</span>
              </div>
              </div>
            </a>
              
              {/if}
              {/each}
              {:else}
              No Notifications
              {/if}
          </div>
          {/if}
      </div>
    </div>
     <div class="navbar-item">
          <a href="/newpost" rel="prefetch"><i class="na-plus-circle" style="color:var(--navbar-color);display:block;margin-top: calc((30px - 19px )/2);font-size:1.2rem;
            margin-right:0.9rem;"></i></a>
      </div>
     <div class="navbar-item" style="cursor: pointer;">
            <div bind:this={user_center} class="newapp-dropdown" id="user-center">
                <img src="{$session.avatar}" bind:this={user_image} id="user-image" height="30px" width="30px" style="border-radius: 30px;margin-top: 1px;" alt="">
              <div bind:this={user} class="newapp-dropdown-content" id="user" style="display: none;">
                @{$session.name}
                <hr>
                <a href="/user/{$session.name}" style="color: var(--navbar-color);">
                <div class="dropdown-item">
                  <i class="na-user"></i> Profile
                </div>
                </a>
                <a href="/user/{$session.name}/settings" style="color: var(--navbar-color);">
                <div class="dropdown-item">
                  <i class="na-user-cog"></i> Settings
                </div>
                </a>
                <span style="color: var(--navbar-color);">
                <div class="dropdown-item" on:click={logOut}>
                  <i class="na-sign-out-alt"></i> Logout
                </div>
                </span>
              </div>
            </div>
          </div>
     {:else}
     <div class="navbar-item" style="margin-inline-start: auto;display:flex;">
        <span style="color: var(--navbar-color);margin-block-start:auto;margin-block-end: auto;cursor: pointer;" on:click={OpenModalLogin}><span
            style="vertical-align: inherit;"><i class="na-sign-in-alt"></i> Login</span></span>
      </div>
     {/if}
		</div>
	</div>
</nav>

{#if $session.auth == false}
<Login/>
<Register/>
<Join/>
{/if}