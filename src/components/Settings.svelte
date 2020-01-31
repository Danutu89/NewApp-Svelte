<script>
export let user;

let editInfo, editMisc;

function SwitchPanel(panel){
    if (panel === 'misc'){
        editInfo.style['display'] = 'none';
        editMisc.style['display'] = 'flex';
    }else if(panel === 'main'){
        editInfo.style['display'] = 'flex';
        editMisc.style['display'] = 'none';
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
          <input id="email" name="email" placeholder="Email" type="text" value="{user.email}">
          Real Name:
          <input id="realname" name="realname" placeholder="Real Name" type="text" value="{user.teal_name}">
          Bio:
          <input id="bio" name="bio" placeholder="Bio" type="text" value="{user.bio}">
          Profession:
          <input id="profession" name="profession" placeholder="Profession" type="text" value="{user.profession}">
          Instagram:
          <input id="instagram" name="instagram" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Instagram" type="text" value="{user.instagram}">
          Facebook:
          <input id="facebook" name="facebook" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Facebook" type="text" value="{user.facebook}">
          Twitter:
          <input id="twitter" name="twitter" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Twitter" type="text" value="{user.twitter}">
          Github:
          <input id="github" name="github" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Github" type="text" value="{user.github}">
          Website:
          <input id="website" name="website" pattern="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&amp;'\(\)\*\+,;=.]+$" placeholder="Website" type="text" value="{user.website}">
        </div>
        <div class="col-2"  style="text-align:left;">
          Gender:
          <br>
          <select id="genre" name="genre"><option selected="" value="Male">Male</option><option value="Female">Female</option></select>
          <br>
          Avatar:
          <br>
          <input type="file" name="avatarimg" value="">
          <br>
          Cover:
          <br>
          <input type="file" name="coverimg" value="">
        </div>
      </div>
      <div class="edit-misc" id="misc" bind:this={editMisc}>
          <div class="col-1" style="text-align:left;">
          <input id="theme_mode" name="theme_mode" type="checkbox" value="y"> Get theme from the system
          <br>
          Theme:
          <br>
          <select id="theme" name="theme"><option value="Light">Light</option><option selected="" value="Dark">Dark</option></select>
          </div>
          <div class="col-2"  style="text-align:left;"></div>
      </div>
    </div>
  </div>
</profile>