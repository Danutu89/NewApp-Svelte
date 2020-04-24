<script context="module">
    import { host } from '../../../modules/Options.js';
    export async function preload(page,session){
        this.redirect(302, host+'/static/thumbnail_post/'+page.params.slug);
        return;
    }
</script>