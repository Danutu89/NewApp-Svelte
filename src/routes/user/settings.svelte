<script context="module">
    import axios from 'axios';
    export async function preload(page,session){
        let args = '';
        if (session.token){
            args = '?t=' + session.token;
        }else{
            this.redirect(302, '/');
        }
        const res = await axios.get('https://newapp.nl/api/user/settings' + args).then(function (response) {
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

<Settings user={user} />