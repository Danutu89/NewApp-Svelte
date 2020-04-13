<script context="module">
    import axios from 'axios';
    import { host } from '../../modules/Options.js';
    export async function preload(page,session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token;
        }else{
            this.redirect(302, '/');
        }
        const res = await axios.get(host+'/api/user/settings' + args).then(function (response) {
                return response.data;
            });
        const json = await res;
        return { user: json.settings };
    }
</script>

<script>
    import Settings from '../../components/Settings.svelte';

    export let user;
</script>

<svelte:head>
<title>Settings - NewApp</title>
<meta name="robots" content="noindex">
</svelte:head>

<Settings user={user} />