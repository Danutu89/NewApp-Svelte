<script>
import { stores, goto } from '@sapper/app';
const { session } = stores();

export let page;
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
            <button>REGISTER</button>
        </div>
    </div>
{/if}
{#if page == "index"}
    
    <div class="widget-posts" id="widget-trending-posts">
        <div class="widget-header">
            <div class="widget-title">Trending Posts 🔥</div>
        </div>
        <div class="widget-list">
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
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                <div class="text">Close Post</div>
                <button class="widget-button">Close</button>
            </div>
            {/if }
            {#if $session.permissions.delete_post_permission }
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                <div class="text">Delete Post</div>
                <button  class="widget-button">Delete</button>
            </div>
            {/if } 
            {#if $session.permissions.edit_post_permission}
            <div class="widget-item" style="display: flex;justify-content: space-between;">
                    <div class="text" style="display:flex;white-space: nowrap;">Edit Post</div>
                    <button class="widget-button">Edit</button>
                </div>
            {/if }
        </div>
    </div>
    {/if}
    <div class="user-card" style="align-items: unset">
        <a rel="prefetch" href="/user/"
            style="margin-bottom:0.2rem;display: flex">
        <div class="user-image">
            <div class="loading" style="height:50px;width:50px;border-radius:50px;"></div>
        </div>
        
            <div class="user-info">
                <span style="display: flex;height:0.92em;margin-bottom: 0.5rem;"><div class="loading" style="width:5rem;height:1rem;"></div><span
                        class="dot_status"style="margin-left: 2%;height: 10px;width: 10px;margin-right: 0;margin-top: 4px;"></span></span>
                <span class="user-tag"><div class="loading" style="width:3rem;height:0.7rem;"></div></span>
            </div>
        </a>
            <div class="profile-actions">
                <button class="follow-user" id="follow-user-">Follow</button>
                
            </div>
        
    </div>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><div class="loading" style="width: 5rem; height: 0.8rem;"></div></div>
        </div>
        <div class="widget-list">
            
            <div class="widget-item">
                <div class="text">
                    <div class="loading" style="width: 60%; height: 0.8rem;"></div>
                </div>
            </div>
            
            <div class="widget-item">
                <div class="text">
                    <div class="loading" style="width: 40%; height: 0.8rem;"></div>
                </div>
            </div>
            <div class="widget-item">
                <div class="text">
                    <div class="loading" style="width: 70%; height: 0.8rem;"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="widget-posts">
        <div class="widget-header" style="border:none;">
            <div class="widget-title"><div class="loading" style="width: 10rem; height: 0.8rem;"></div></div>
        </div>
        <div class="widget-list" style="max-height: 550px;/* overflow: auto; */">
            {#each Array(5) as x}
            <div class="widget-post">
                <div class="post-header">
                    <div class="loading" style="width: 40px; height: 40px;border-radius: 40px;"></div>
                    </div>
                <div class="post-footer" style="margin-left: 2%;">
                    <div class="post-title">
                        <a rel="prefetch" href="/post/">
                                <div class="loading post-title" style="width: 10rem; height: 1rem;"></div>
                            </a>
                    </div>
                    <div class="post-tags" style="display: flex;margin-top: 0.4rem;">
                    

                        <div class="loading" style="width: 2rem; height: 0.8rem;"></div>
                        <div class="loading" style="width: 3rem; height: 0.8rem;"></div>

                    
                    </div>
                </div>
            </div>
            {/each}
        </div>
    </div>
{/if}
</div>