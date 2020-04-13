<script>
export let not;
let notifications = not.notify['new'];

function Switch_Not(type){
    switch (type) {
        case 0:
            notifications = not.notify['new'];
            break;
        case 1:
            notifications = not.notify['posts'];
            break;
        case 2:
            notifications = not.notify['comments'];
            break;
        case 3:
            notifications = not.notify['likes'];
            break;
        case 4:
            notifications = not.notify['follows'];
            break;
    }
}

</script>

<notifications>
    <div class="category">
        <div class="header">
            <span>Notifications</span>
        </div>
        <button on:click={()=>{Switch_Not(0)}}>New</button>
        <button on:click={()=>{Switch_Not(1)}}>Posts</button>
        <button on:click={()=>{Switch_Not(2)}}>Comments</button>
        <button on:click={()=>{Switch_Not(3)}}>Likes</button>
        <button on:click={()=>{Switch_Not(4)}}>Follows</button>
    </div>
    <div class="notifications">
    {#each notifications as notification}
        <a href="{notification.link}">
            <div class="notification">
                <img class="avatar" data="{notification.author.avatar}" alt="{notification.author.name}" width="60px" onerror="this.style.display='none'" height="60px">
                <div class="body">
                    <span class="text">
                        <span style="color: var(--color);">{notification.title}</span>
                        {#if notification.category != 'follow'}
                        <span style="color: var(--link);">{notification.body}</span>
                        {/if}
                    </span>
                    <span class="time">
                        {notification.time_ago} ago
                    </span>
                </div>
            </div>
        </a>
    {/each}
    </div>
</notifications>