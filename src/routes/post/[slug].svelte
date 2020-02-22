<script context="module">
    import axios from 'axios';
    export async function preload(page, session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token;
        }
        let temp = (page.params.slug).toString().split("-");
        let id = temp[temp.length-1];
        const res = await axios.get('https://newapp.nl/api/post/'+id+ args).then(function (response) {
                return response.data;
            });
        const json = await res;
        json['link'] = page.params.slug;
        return { article: json };
    }
</script>

<script>
import Post from '../../components/Post.svelte';
import SideBarRight from '../../components/SideBarRight.svelte';
export let article;

</script>

<svelte:head>
<title>{article.title} - NewApp</title>
<meta name="description" content="{article.description}...">
<meta property="og:type" content="website">
<meta property="og:url" content="/post/{article.link}">
<meta property="og:site_name" content="{article.title}">
<meta name="twitter:title" content="{article.title}">
{#if article.thumbnail}
<meta property="og:image" itemprop="image primaryImageOfPage" content="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg">
<meta name="twitter:image:src" content="https://newapp.nl/static/thumbnail_post/post_{article.id}.jpeg">
{:else}
<meta property="og:image" itemprop="image primaryImageOfPage" content="{article.author.avatar}">
<meta name="twitter:image:src" content="{article.author.avatar}">
{/if}
<meta property="og:description" content="{article.description}...">
<meta name="twitter:description" content="{article.description}...">
<meta name="keywords" content="{article.keywords}newapp">
</svelte:head>

{#if article}
<Post {article}/>

<SideBarRight author={article.author} user={article.user} article={article} page={"post"}/>
{/if}


