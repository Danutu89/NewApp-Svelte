<script context="module">
    import { instance } from '../modules/Requests.js';
    import { host } from '../modules/Options.js';
    export async function preload(page,session){
        if (session.auth == false){
            this.redirect(302, '/');
        }
        const res = await instance.get('/api/notifications?ex=true').then(function (response) {
                return response.data;
            });
        const json = await res;
        return { notifications: json };
    }
</script>
<script>
import Notifications from '../components/Notifications.svelte';

export let notifications;

</script>

<Notifications not={notifications}/>

<svelte:head>
<title>Notifications - NewApp</title>
<meta name="robots" content="noindex">
</svelte:head>