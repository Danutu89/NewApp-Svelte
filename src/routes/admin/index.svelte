<script context="module">
    import axios from 'axios';
    export async function preload(page, session){
        if (session.auth == false){
            this.redirect(302, '/');
        }
        const res = await axios.get('http://localhost:5000/api/admin/dashboard' + '?t=' + session.token).then(function (response) {
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