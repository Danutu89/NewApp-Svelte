<script>
import {instance} from '../modules/Requests.js';
import { onMount } from 'svelte';
import { stores, goto } from '@sapper/app';
import { host } from '../modules/Options.js';
import Cookie from 'cookie-universal';
const cookies = Cookie();
const {session} = stores();
var jwt_decode = require('jwt-decode');

export let user;

let decoded=false;

let editInfo, editMisc;
let s_real_name=user.real_name,
    s_email=user.email,
    s_bio=user.bio,
    s_profession=user.profession,
    s_i=user.instagram,
    s_f=user.facebook,
    s_t=user.twitter,
    s_g=user.github,
    s_w=user.website;
let s_genre=user.genre,
    s_theme_mode=user.theme_mode,
    s_theme=user.theme;
let s_avatarimg, s_coverimg;
let c_coverimg,c_avatarimg;
let isMobile;

function SwitchPanel(panel){
    if (panel === 'misc'){
      if(isMobile){
        editInfo.style['display'] = 'none';
        editMisc.style['display'] = 'block';
      }else{
        editInfo.style['display'] = 'none';
        editMisc.style['display'] = 'flex';
      }
    }else if(panel === 'main'){
      if(isMobile){
        editInfo.style['display'] = 'block';
        editMisc.style['display'] = 'none';
      }else{
        editInfo.style['display'] = 'flex';
        editMisc.style['display'] = 'none';
      }
    }
}

async function SaveSettings(){
  var token = $session.token;
  let formdata = new FormData();

  try {
      formdata.append('avatarimg', s_avatarimg.files[0], s_avatarimg.files[0].name);
      c_avatarimg = true;
  } catch (error) {
      c_avatarimg = false;
  }

  try {
      formdata.append('coverimg', s_coverimg.files[0], s_coverimg.files[0].name);
      c_coverimg = true;
  } catch (error) {
      c_coverimg = false;
  }

  let payload = {
    email: s_email, 
    real_name: s_real_name, 
    bio: s_bio, 
    profession: s_profession, 
    instagram: s_i, 
    facebook: s_f, 
    twitter: s_t, 
    github: s_g, 
    website: s_w, 
    genre: s_genre, 
    theme_mode: s_theme_mode, 
    theme: s_theme,
    avatarimg: c_avatarimg,
    coverimg: c_coverimg
  }
  formdata.append('data', JSON.stringify(payload));

  const resp = await instance.post('/api/user/settings', formdata, {headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
    return response;
  })

  if (resp.status != 200){
    //alert
    return;
  }

  try {
    decoded = jwt_decode(resp.data['token']);
  } catch (error) {
    decoded = false;
  }

  if (decoded != false){
    cookies.set("token", resp.data['token'],{maxAge:60 * 60 * 24 * 30, path: '/'});
    session.set({
				name: decoded.name,
				id: decoded.id,
				avatar: decoded.avatar,
				token: resp.data['token'],
				real_name: decoded.real_name,
				permissions: decoded.permissions,
				theme: decoded.theme,
				theme_mode: decoded.theme_mode,
				auth: true
			})
  }else{
    //alert
    return;
  }

  goto('/user/'+user.name);

}

onMount(async function(){
  isMobile = window.matchMedia("only screen and (max-width: 800px)").matches;
  s_coverimg = document.getElementById('coverimg');
  s_avatarimg = document.getElementById('avatarimg');
})

function showEdit(input){
  console.log(this);
  var _input = document.getElementById(input);
  var _text = document.getElementById(input+'_text');
  if (_input.style.display == 'none'){
    _input.style.display = 'block';
    _text.style.display = 'none';
  }else{
    _input.style.display = 'none';
    _text.style.display = 'block';
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
      <div class="profile-image">
        <div>
          <img src="{user.avatar}" alt="" onerror="this.style.display='none'">
        </div>

        <div class="user-name" style="line-height: 1.7rem;">
          <h1 style="font-weight: 400;">{user.real_name}</h1>
            <h4 style="font-weight: 400;">@{user.name}</h4>
        </div>
      </div>
      <div class="profile-actions">
          <button type="submit" class="save-settings" on:click={SaveSettings}>Save</button>
      </div>
      <div class="widgets">
        <div class="settings-menu">
          <div class="header">Settings</div>
          <div class="settings">
            <div class="item" on:click={()=>SwitchPanel('main')}>Main Info</div>
              <div class="item" on:click={()=>SwitchPanel('misc')}>Misc</div>
            </div>
        </div>
      </div>
    </div>
    <div class="sidebar-main">
      <div class="edit-info" id="main" bind:this={editInfo}>
        <div class="col-1" style="text-align:left;">
          <div style="display: flex;margin-bottom:1rem;">
              <input id="email" name="email" placeholder="Email" type="text" style="display: none;margin-bottom:0;margin-right:0.5rem;" bind:value={s_email}>
              <p style="font-weight: 500;margin: 0.41em 0;" id="email_text">Email: {user.email}</p>
              <span class="modify-button na-pencil-alt" on:click={()=>showEdit('email')}></span>
          </div>

          <div style="display: flex;margin-bottom:1rem;">
              <input id="realname" name="realname" placeholder="Real Name" style="display: none;margin-bottom:0;margin-right:0.5rem;" type="text"  bind:value={s_real_name}>
              <p style="font-weight: 500;margin: 0.41em 0;" id="realname_text">Real Name: {user.real_name}</p>
              <span class="modify-button na-pencil-alt" on:click={()=>showEdit('realname')}></span>
          </div>

          <div style="display: flex;margin-bottom:1rem;">
              <input id="bio" name="bio" placeholder="Bio" type="text" style="display: none;margin-bottom:0;margin-right:0.5rem;" bind:value={s_bio}>
              <p style="font-weight: 500;margin: 0.41em 0;" id="bio_text">Bio: {user.bio}</p>
              <span class="modify-button na-pencil-alt" on:click={()=>showEdit('bio')}></span>
          </div>

          <div style="display: flex;margin-bottom:1rem;">
              <input id="profession" name="profession" placeholder="Profession" style="display: none;margin-bottom:0;margin-right:0.5rem;" type="text" bind:value={s_profession}>
              <p style="font-weight: 500;margin: 0.41em 0;" id="profession_text">Profession: {user.profession}</p>
              <span class="modify-button na-pencil-alt" on:click={()=>showEdit('profession')}></span>
          </div>

          <div style="display: flex;margin-bottom:1rem;">
              <div class="input-group" style="display: none;margin-bottom:0;margin-right:0.5rem;" id="_instagram">
                <div class="input-group-icon">https://instagram.com/</div>
                <div class="input-group-area"><input id="instagram" name="instagram" placeholder="Instagram" type="text" style="margin-bottom:0;height:100%;" bind:value={s_i}></div>
              </div>
              <p style="font-weight: 500;margin: 0.5em 0;" id="_instagram_text">Instagram: {user.instagram}</p>
              <span class="modify-button na-pencil-alt" on:click={()=>showEdit('_instagram')}></span>
          </div>
          
          Instagram:
          <div class="input-group">
            <div class="input-group-icon">https://instagram.com/</div>
            <div class="input-group-area"><input id="instagram" name="instagram" placeholder="Instagram" type="text" bind:value={s_i}></div>
          </div>
          Facebook:
          <div class="input-group">
            <div class="input-group-icon">https://facebook.com/</div>
            <div class="input-group-area"><input id="facebook" name="facebook" placeholder="Facebook" type="text" bind:value={s_f}></div>
          </div>
          Twitter:
          <div class="input-group">
            <div class="input-group-icon">https://twitter.com/</div>
            <div class="input-group-area"><input id="twitter" name="twitter" placeholder="Twitter" type="text" bind:value={s_t}></div>
          </div>
          Github:
          <div class="input-group">
            <div class="input-group-icon">https://github.com/</div>
            <div class="input-group-area"><input id="github" name="github" placeholder="Github" type="text" bind:value={s_g}></div>
          </div>
          Website:
          <input id="website" name="website" placeholder="Website" type="text" bind:value={s_w}>
        </div>
        <div class="col-2"  style="text-align:left;">
          Gender:
          <br>
          <select id="genre" bind:value={s_genre} name="genre"><option value="Male">Male</option><option value="Female">Female</option></select>
          <br>
          Avatar:
          <br>
          <input type="file" name="avatarimg" id="avatarimg">
          <br>
          Cover:
          <br>
          <input type="file" name="coverimg" id="coverimg">
        </div>
      </div>
      <div class="edit-misc" id="misc" bind:this={editMisc}>
          <div class="col-1" style="text-align:left;">
          
          <input id="theme_mode" name="theme_mode" type="checkbox" bind:value={s_theme_mode} > Get theme from the system
          <br>
          Theme:
          <br>
          <select id="theme" name="theme" bind:value={s_theme}><option value="Light">Light</option><option value="Dark">Dark</option></select>
          </div>
          <div class="col-2"  style="text-align:left;"></div>
      </div>
    </div>
  </div>
</profile>