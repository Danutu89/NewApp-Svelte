<script>
import { stores } from '@sapper/app';
const { session } = stores();
</script>

<div class="sidebar-admin">
        <div class="user-card">
                <a href="/user/danutu" style="display: flex;">
                        <div class="user-image" style="margin-bottom:0;">
                                <img class="profile_image" alt="" src="{$session.avatar}" height="50px" width="50px" title="profile image">
                        </div>
                        <div class="user-info" style="margin-top: -0.2rem;"><span>{$session.real_name}</span> <br> <span
                        class="user-tag">@{$session.name}</span>
                        </div>
                </a>
        </div>
        <div class="navigation">
                <div class="header">
                        <span>Navigation</span>
                </div>
                <a href="/admin/"><div class="item">
                        <span>Dashboard</span>
                </div></a>
                <a href="/admin/posts"><div class="item">
                        <span>Posts</span>
                </div></a>
                <a href="/admin/sessions"><div class="item">
                        <span>Sessions</span>
                </div></a>
                <a href="/admin/users"><div class="item">
                        <span>Users</span>
                </div></a>
        </div>
</div>