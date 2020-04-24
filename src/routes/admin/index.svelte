<script context="module">
    import {instance} from '../../modules/Requests.js';
    export async function preload(page, session){
        if (session.auth == false){
            this.redirect(302, '/');
        }
        const res = await instance.get('/api/admin/dashboard').then(function (response) {
                return response.data;
            });
        const response = await res;
        return { json: response };
    }
</script>

<script>
import Dashboard from '../../components/admin/Dashboard.svelte';
export let json;
</script>

<svelte:head>
<title>NewApp - Admin</title>
<meta name="robots" content="noindex">
</svelte:head>

<Dashboard json={json}/>