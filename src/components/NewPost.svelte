<script>
import { onMount } from 'svelte';
import marked from 'marked';
import {instance} from '../modules/Requests.js';
import { host } from '../modules/Options.js';
import { stores, goto } from '@sapper/app';
const { session } = stores();

let editor, editor_s;
let title, title_s;
let tags, tags_s;
let thumbnail;

async function NewPost(){
    if(editor.value().length < 2){
        if(!editor_s){
            editor_s = document.querySelectorAll("textarea")[1];
        }
        editor_s.setCustomValidity('Please fill out this field.');
        editor_s.classList.add('error');
        editor_s.reportValidity();
        return;
    }
    if(!title){
        title_s.setCustomValidity('Please fill out this field.');
        title_s.classList.add('error');
        title_s.reportValidity();
        return;
    }
    if(!tags){
        tags_s.setCustomValidity('Please fill out this field.');
        tags_s.classList.add('error');
        tags_s.reportValidity();
        return;
    }
    let markdown = marked(editor.value());
    let image = false;
    let formdata = new FormData();
    try {
        formdata.append('image', thumbnail.files[0], thumbnail.files[0].name);
        image = true;
    } catch (error) {
        image = false;
    }
    let pyaload = {content: markdown, title: title, tags: tags, token: $session.token, image: image}
    formdata.append('data', JSON.stringify(pyaload));

    let json = await instance.post(host+'/api/newpost', formdata, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) =>{
        return response.data;
    })
    let data = await json;
    if (data['operation'] == 'success'){
        editor.value("");
        goto(data['link']);
    }else if (data['operation'] == 'error'){
        console.log(data['error']);
    }
}

onMount(async function(){
    editor_s = document.querySelectorAll("textarea")[1];
    let SimpleMDE = require('simplemde');
    editor = new SimpleMDE({ element: document.getElementById("editor"), toolbar: false, status: false });
    thumbnail = document.getElementById('file-upload');
})
</script>

<new_post>
    <div class="newpost-info">
        <strong>Informations:</strong>
        <p>If you wanna start a discussion add <tag>discuss</tag> in the tags section</p>
        <p>If you wanna ask a question add <tag>help</tag> / <tag>question</tag> in the tags section</p>
        <p>If you wanna create a tutorial add <tag>tutorial</tag> / <tag>howto</tag> in the tags section</p>
    </div>
    <div class="newpost-form">
        <div class="header">
            <input id="title" bind:this={title_s} bind:value={title} name="title" placeholder="Title" required="true" style="background: transparent !important;
                font-size: 2rem;" type="text">
            <div style="display: flex;">
            <input id="tag" bind:value={tags} bind:this={tags_s} name="tag" placeholder="Separate tags with commas" required="true" style="border: var(--border);background-color:transparent;" type="text">
            <label for="file-upload" class="file-upload">
                <i class="na-image" style="vertical-align: sub;"></i>
            </label>
            <input type="file" id="file-upload" name="thumbnail" style="display: none">
        </div>
        </div>
        <br>
        <div class="body">
            <textarea id="editor"></textarea>
        </div>
        <div class="footer">
            <button on:click={NewPost} class="newpost">Post</button>
        </div>
    </div>
</new_post>