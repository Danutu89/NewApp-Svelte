<script>
import { onMount } from 'svelte';
import imageHandler from '../modules/ImageHandler.js';

let editor_sett, editor;

onMount(async function(){
    var toolbarOptions = [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{
          'header': [1, 2, 3, 4, 5, 6, false]
      }],
      [{
          'color': []
      }, {
          'background': []
      }],
      [{
          'font': []
      }],
      [{
          'align': []
      }],
      ['emoji'],
    ];
    let quill = require('quill');
    editor_sett = new quill(editor, {
            modules: {
                toolbar: {
                  container: toolbarOptions,
                  handlers: {
                      image: imageHandler
                  }
                }
            },
            theme: 'snow',
        });
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
            <input id="title" name="title" placeholder="Title" required="true" style="background: transparent !important;
                font-size: 2rem;" type="text" value="">
            <div style="display: flex;">
            <input id="tag" name="tag" placeholder="Separate tags with commas" required="true" style="border: var(--border);background-color:transparent;" type="text" value="">
            <label for="file-upload" class="file-upload">
                <i class="na-image" style="    vertical-align: sub;"></i>
            </label>
            <input type="file" id="file-upload" name="thumbnail" style="display: none">
        </div>
        </div>
        <br>
        <div class="body">
            <div id="editor" bind:this={editor}></div>
        </div>
        <div class="footer">
            <button type="submit" class="newpost">Post</button>
        </div>
    </div>
</new_post>