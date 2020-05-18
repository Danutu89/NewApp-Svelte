
<script>
import { stores, goto } from '@sapper/app';
import { onMount } from 'svelte';
import marked from 'marked';
import { host } from '../modules/Options.js';
import TurndownService from 'turndown';
import {instance} from '../modules/Requests.js';
import {activateAlert} from "../modules/Alert.js";
const { session } = stores();

export let article;
let title_c = article.title;
let title_s, editor_s;
let editor;
let turndown = TurndownService();
let text_c = turndown.turndown(article.text);

async function EditPost(){
    const res = await instance.post('/api/post/edit/'+article.id,{title: title_c,text: marked(editor.value()),id: article.id}).then(function (response) {
            if(response.status !=200){
                //alert
                return;
            }
            if(response.data['operation'] == 'failed'){
                //alert
                return;
            }
            activateAlert( "/static/logo.svg", "Post", "Post edited successfully.", '/post/'+response.data['link']);
            goto('/post/'+response.data['link']);
        });
    const json = await res;

}

onMount(async function(){
    editor_s = document.querySelectorAll("textarea")[1];
    let SimpleMDE = require('simplemde');
    editor = new SimpleMDE({ element: document.getElementById("editor"), toolbar: false, status: false });
    editor.value(text_c);
});

</script>
<editpost>
    <div class="newpost-form">
        <div class="header">
            <input id="title" bind:this={title_s} bind:value={title_c} name="title" placeholder="Title" required="true" style="background: transparent !important;
                font-size: 2rem;" type="text">
        </div>
        <br>
        <div class="body">
            <textarea id="editor"></textarea>
        </div>
        <div class="footer">
        <button on:click={EditPost} class="newpost">Edit</button>
        </div>
    </div>
</editpost>

<svelte:head>
    <title>Edit - {title_c}</title>
</svelte:head>