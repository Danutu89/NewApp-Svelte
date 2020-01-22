<script>
import Login from './Login.svelte';
import Register from './Register.svelte';
import { onMount, onDestroy  } from 'svelte';
import { stores } from '@sapper/app';
import Cookie from 'cookie-universal';
const cookies = Cookie();
const { session, page } = stores();

let modal, user = null, user_center = null, user_image = null, overflow = null;
var menu_open = false;

function logOut(){
  cookies.remove("token");
  location.reload();
}

function onClickDocument(e){
  if($session.auth){
    if(e.target != user_image && e.target != user_center){
      user.style["display"] = "none";
      overflow.classList.remove("show");
      menu_open = false;
    }else if(e.target == user_image){
      if(user.style["display"] == "none"){
        user.style["display"] = "block";
        overflow.classList.add("show");
        menu_open = true;
      }else{
        user.style["display"] = "none";
        overflow.classList.remove("show");
        menu_open = false;
      }
    }
  }
  if (menu_open === true) {
    return false;
  }
}

onMount(async function(){
  modal = document.getElementById("login-modal");
  overflow = document.querySelector("overflow");
  document.addEventListener('click', onClickDocument, {
    capture: true
  });

  return () => {
    document.removeEventListener('click', onClickDocument, {
      capture: true
    });
  }

});

function OpenModalLogin(){
  if (modal.style["opacity"] < 1){
    modal.style["visibility"] = "visible";
    modal.style["opacity"] = 1;
    modal.style["pointer-events"] = "auto";
  }else{
    modal.style["visibility"] = "hidden";
    modal.style["opacity"] = 0;
    modal.style["pointer-events"] = "none";
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
        <form action="/" method="GET">
          <input type="text" name="search" placeholder="Search" id="search">
        </form>
      </div>
	   <div style="margin-inline-start: auto;display:flex;">
     {#if $session.auth == true}
     <div class="navbar-item">
          <a href="/newpost"><i class="na-plus-circle" style="color:var(--navbar-color);display:block;margin-top: calc((30px - 19px )/2);font-size:1.2rem;
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
{/if}