<script context="module">
    import { instance } from '../../modules/Requests.js';
    export async function preload(page,session){
        if (session.token===false){
            this.redirect(302, '/');
        }
        const res = await instance.get('/api/user/settings').then(function (response) {
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