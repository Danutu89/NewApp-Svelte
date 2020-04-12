<script context="module">
    import axios from 'axios';
    import { host } from '../../../modules/Options.js';
    export async function preload(page, session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token;
        }else{
            this.redirect(302, '/');
        }
        let temp = (page.params.slug).toString().split("-");
        let id = temp[temp.length-1];
        const res = await axios.get(host+'/api/post/edit/'+id+ args).then(function (response) {
                return response.data;
            });
        const json = await res;
        return { article: json };
    }   
</script>

<script>
import EditPost from '../../../components/EditPost.svelte';

export let article;
</script>

<EditPost article={article}/>

<svelte:head>
<title>Edit Profile - NewApp</title>
<meta name="robots" content="noindex">
</svelte:head>