<script context="module">
    import { instance } from '../../modules/Requests.js';
    import { isSSR } from '../../modules/Preloads.js';
    export async function preload(page,session){
        let temp = (page.params.slug).toString().split("-");
        let id = temp[temp.length-1];
        let isSSRPage;
        const res = instance.get('/api/post/'+id);
        isSSR.subscribe(value => {
            isSSRPage = value;
        })();

        if(!isSSRPage) {
            return { data: res };
        }

        const resp = await res.then(function (response) {
            return response;
        });

        if (resp.status == 404){
            return this.error(404, 'Not Found');
        }

        const json = await resp.data;
        
        
        return {data: json};
    }
</script>

<script>
import Post from '../../components/Pages/Post.svelte';
export let data;

</script>


<Post data={data}/>



