<script context="module">
    import { host } from '../../../modules/Options.js';
    export async function preload(page,session){
        this.redirect(302, host+'/static/profile_pics/'+page.params.slug);
        return;
    }
</script>