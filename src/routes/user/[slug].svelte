<script context="module">
    import { instance } from '../../modules/Requests.js';
    export async function preload(page,session){
        try {
            const res = await instance.get('/api/user/'+page.params.slug).then(function (response) {
                return response.data;
            });
            const json = await res;
            return { user: json };
        } catch (error) {
            return this.error(404, 'Not Found');
        }
        
    }
</script>

<script>
import User from '../../components/User.svelte';
export let user;

</script>

<svelte:head>
<title>{user.real_name} - NewApp</title>
<meta name="keywords" content="newapp,{user.name}">
<meta name="description" content="{user.name} - {user.bio}">
<meta property="og:type" content="website">
<meta property="og:url" content="/user/{user.name}">
<meta property="og:site_name" content="{user.name}">
<meta property="og:image" itemprop="image primaryImageOfPage" content="{user.avatar}">
<meta property="og:description" content="{user.bio}">
<meta name="twitter:title" content="{user.name}">
<meta name="twitter:description" content="{user.bio}">
<meta name="twitter:image:src" content="{user.avatar}">
</svelte:head>

<User {user}/>