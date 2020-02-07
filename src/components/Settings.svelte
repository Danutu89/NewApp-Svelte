<script>
import axios from 'axios';
import { onMount } from 'svelte';
import { stores, goto } from '@sapper/app';
const {session} = stores();

export let user;

let editInfo, editMisc;
let s_real_name,s_email,s_bio,s_profession,s_i,s_f,s_t,s_g,s_w;
let s_genre,s_theme_mode,s_theme;
let s_avatarimg, s_coverimg;
let c_coverimg,c_avatarimg;

function SwitchPanel(panel){
    if (panel === 'misc'){
        editInfo.style['display'] = 'none';
        editMisc.style['display'] = 'flex';
    }else if(panel === 'main'){
        editInfo.style['display'] = 'flex';
        editMisc.style['display'] = 'none';
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
    bio: s_bio, profession: s_profession, 
    instagram: s_i, 
    facebook: s_f, 
    twitter: s_t, 
    github: s_g, 
    website: s_w, 
    genre: s_genre, 
    theme_mode: 
    s_theme_mode, 
    theme: s_theme,
    avatarimg: c_avatarimg,
    coverimg: c_coverimg
  }
  formdata.append('data', JSON.stringify(pyaload));

  const resp = await axios.post('https://newapp.nl/api/user/settings?t='+token, formdata, {headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
    return response;
  })

  if (resp.status != 200){
    //alert
    return;
  }

  goto('/user/'+user.name);

}

onMount(async function(){
  s_coverimg = document.getElementById('coverimg');
  s_avatarimg = document.getElementById('avatarimg');
})
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
          <img src="{user.avatar}" alt="">
        </div>

        <div class="user-name" style="line-height: 1.7rem;">
          <h1 style="font-weight: 400;">{user.real_name}</h1>
            <h4 style="font-weight: 400;">@{user.name}</h4>
        </div>
      </div>
      <div class="profile-actions">
          <button type="submit" class="save-settings">Save</button>
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
          Email:
          <input id="email" name="email" placeholder="Email" type="text" bind:value={s_email} value="{user.email}">
          Real Name:
          <input id="realname" name="realname" placeholder="Real Name" type="text" bind:value={s_real_name} value="{user.real_name}">
          Bio:
          <input id="bio" name="bio" placeholder="Bio" type="text" bind:value={s_bio} value="{user.bio}">
          Profession:
          <input id="profession" name="profession" placeholder="Profession" type="text" bind:value={s_profession} value="{user.profession}">
          Instagram:
          <input id="instagram" name="instagram" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Instagram" type="text" bind:value={s_i} value="{user.instagram}">
          Facebook:
          <input id="facebook" name="facebook" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Facebook" type="text" bind:value={s_f} value="{user.facebook}">
          Twitter:
          <input id="twitter" name="twitter" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Twitter" type="text" bind:value={s_t} value="{user.twitter}">
          Github:
          <input id="github" name="github" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Github" type="text" bind:value={s_g} value="{user.github}">
          Website:
          <input id="website" name="website" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Website" type="text" bind:value={s_w} value="{user.website}">
        </div>
        <div class="col-2"  style="text-align:left;">
          Gender:
          <br>
          <select id="genre" name="genre"><option selected="" value="Male">Male</option><option value="Female">Female</option></select>
          <br>
          Avatar:
          <br>
          <input type="file" name="avatarimg" id="avatarimg" value="">
          <br>
          Cover:
          <br>
          <input type="file" name="coverimg" id="coverimg" value="">
        </div>
      </div>
      <div class="edit-misc" id="misc" bind:this={editMisc}>
          <div class="col-1" style="text-align:left;">
          <input id="theme_mode" name="theme_mode" type="checkbox" bind:value={s_theme_mode} value="y"> Get theme from the system
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