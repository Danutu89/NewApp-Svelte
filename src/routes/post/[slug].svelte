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
        return { article: json };
    }
</script>

<script>
import { onMount } from 'svelte';
import Post from '../../components/Post.svelte';
export let article;

onMount(async function(){
    if (article)
        document.title = article.title;
});

</script>

{#if article}
<Post {article}/>
{/if}


