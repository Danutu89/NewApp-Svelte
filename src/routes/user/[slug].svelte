<script context="module">
    import axios from 'axios';
    export async function preload(page,session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token;
        }
        const res = await axios.get('https://newapp.nl/api/user/'+page.params.slug + args).then(function (response) {
                return response.data;
            });
        const json = await res;
        return { user: json };
    }
</script>

<script>
import User from '../../components/User.svelte';
export let user;

import {onMount} from 'svelte';

onMount(async function(){
    if (user)
        document.title = user.real_name;
});

</script>

<User {user}/>