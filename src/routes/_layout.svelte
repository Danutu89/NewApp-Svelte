<script>
	import {onMount} from 'svelte'
	import Nav from '../components/Nav.svelte';
	import { loadProgressBar } from 'axios-progress-bar';
	import { stores } from '@sapper/app';
	const { session } = stores();
	
	onMount(async function() {
		loadProgressBar();
	});
</script>

{#if $session.auth}
{#if $session.theme_mode != 'system'}
{#if $session.theme === 'Dark'}
<style>
:root{
	--background: #171717;
	--color: rgb(196, 196, 196);
	--body-bg: #121212;
	--border: 1px solid rgba(0, 0, 0, 0.125);
	--editor: #2d2d2d;
	--code: #212121;
	--placeholder: rgba(255, 255, 255, 0.836);
	--link: rgb(0, 157, 230);
	--navbar: #171717;
	--navbar-color: rgb(196, 196, 196);
	--navbar-dropdown-hover: #1f1f1f;
	--wrapper-background: #171717;
}
</style>
{:else if $session.theme === 'Light'}
<style>
:root{
	--background: white;
	--color: #212529;
	--body-bg: #efefef;
	--border: 1px solid #d6d6d6;
	--editor: trasparent;
	--code: #efefef;
	--placeholder: rgba(90, 90, 90, 0.836);
	--link: rgb(0, 157, 230);
	--navbar: white;
	--navbar-color: #212529;
	--navbar-dropdown-hover: #ececec;
	--wrapper-background: white;
}
</style>
{/if}
{/if}
{/if}


<Nav/>

<reload style="height: 3rem;display:block"></reload>

<overflow></overflow>

<content>
	<slot></slot>
</content>



