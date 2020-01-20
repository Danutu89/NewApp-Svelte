<script>

export let articles;
export let user;

function Like_Post(id) {
    fetch('https://newapp.nl/api/like-post/' + id)
        .then(response => response.json())
        .then(data => {
            x = document.getElementById('heart');
            x.classList.toggle('far');
            x.classList.toggle('fas');

            y = document.getElementById('hearts');
            if (data.operation == 'unliked') {
                var likes = parseInt(y.innerHTML);
                var total = likes - 1;
                y.innerHTML = total;
            } else if (data.operation == 'liked') {
                var likes = parseInt(y.innerHTML);
                var total = likes + 1;
                y.innerHTML = total;
            }

        })
}

</script>

{#if user}
{#each articles as article}
		<div class="article-card" id="post_{article.id}" >
		<div class="article-main">
                 <div class="article-author-image"><img class="profile_image"
                    loading="lazy" src="{article.author.avatar}" height="50px" width="50px" title="profile image" alt="{article.author.name}">
                </div>
                <div class="article-info">
                    <div class="article-title"><a rel="prefetch" href="/post/{article.link}"><h1 style="font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;">{article.title}</h1></a></div>
                    <div class="article-author">Author: {article.author.name}</div>
                    <div class="article-tags">
                        <span>Tags: </span>
                        {#each article.tags as tag}
                        <a href="/tag/{tag}" rel="prefetch" style="margin-right: 0.1rem;"><tag class="article-tag">{tag}</tag></a>
                        {/each}
                    </div>
                </div>
                </div>
                <div class="article-footbar">
                <div class="article-date">Published {article.posted_on} ago</div>
                <div class="article-misc">
                        <span class="article-readtime" style="
                        font-size: 0.8rem;
                        color: grey;
                        margin-right: 0.4rem;">
                            {article.read_time}
                        </span>
                </div>
                </div>
            </div> 
	{/each}
{:else}
<div class="articles">
	{#each articles as article}
		<div class="article-card" id="post_{article.id}">
        {#if article.thumbnail}
        <div class="article-thumbnail" style="max-height:300px;overflow: hidden;">
                        <img loading="lazy" alt=""
                          src="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg" style="border-top-left-radius: 4px;
                          border-top-right-radius: 4px;object-fit: cover;">
                </div>
        {/if}
		<div class="article-main">
                 <div class="article-author-image"><img class="profile_image"
                    loading="lazy" src="{article.author.avatar}" height="50px" width="50px" title="profile image" alt="{article.author.name}">
                </div>
                <div class="article-info">
                    <div class="article-title"><a rel="prefetch" href="/post/{article.link}"><h1 style="font-size: 1.5rem;
                        font-weight: 400;
                        margin: 0;">{article.title}</h1></a></div>
                    <a rel="prefetch" href="/user/{article.author.name}"><div class="article-author">Author: {article.author.name}</div></a>
                    <div class="article-tags">
                        <span>Tags: </span>
                        {#each article.tags as tag}
                        <a href="/tag/{tag}" rel="prefetch" style="margin-right: 0.1rem;"><tag class="article-tag">{tag}</tag></a>
                        {/each}
                    </div>
                </div>
                </div>
                <div class="article-footbar">
                <div class="article-date">Published {article.posted_on} ago</div>
                <div class="article-misc">
                        <span class="article-readtime" style="
                        font-size: 0.8rem;
                        color: grey;
                        margin-right: 0.4rem;">
                            {article.read_time}
                        </span>
                </div>
                </div>
            </div> 
	{/each}
</div>
{/if}