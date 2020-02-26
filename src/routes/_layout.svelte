<script>
	import {onMount} from 'svelte'
	import Nav from '../components/Nav.svelte';
	import { loadProgressBar } from 'axios-progress-bar';
	import { stores } from '@sapper/app';
	const { session } = stores();
	import {socketio} from '../modules/SocketIO';
	
	onMount(async function() {
		loadProgressBar();
		if($session.auth){
			socketio.on('connect', function () {
				socketio.emit('access', {
					data: $session.token
				});												
			});
			socketio.on('logout', function () {
				socketio.emit('exit', {
					data: $session.token
				});												
			});					
			if (window.Notification && Notification.permission !== "granted") {
				Notification.requestPermission(function (status) {
				if (Notification.permission !== status) {
					Notification.permission = status;
				}
				if (Notification.permission === 'granted'){
					if ('serviceWorker' in navigator) {
						navigator.serviceWorker.controller.postMessage($session.token);
					}
				}
				});
			}
			else if (Notification.permission === 'granted'){
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.controller.postMessage($session.token);
				}
		    }
		}
	});
</script>

{#if $session.auth}
{#if $session.theme_mode != 'system'}
{#if $session.theme === 'Dark'}
<style>
:root{
	--background: #1e1e1e;
	--background-1: #2d2d2d;
	--color: rgb(255, 255, 255);
	--body-bg: #121212;
	--border: 1px solid rgba(47, 47, 47, 0.125);
	--editor: #2d2d2d;
	--code: #313131;
	--code-color: #e6db74;
	--placeholder: rgba(255, 255, 255, 0.836);
	--link: rgb(0, 157, 230);
	--navbar: #262626;
	--navbar-color: rgb(196, 196, 196);
	--navbar-dropdown-hover: #333333;
	--wrapper-background: var(--navbar);
	--input-group-bg: #2d2d2d;
	--input-group-color: #d2d2d2;
	--input-group-border: #4c4c4c 1px solid;
}
</style>
{:else if $session.theme === 'Light'}
<style>
:root{
	--background: #ffffff;
	--background-1: #efefef;
	--color: #212529;
	--body-bg: #efefef;
	--border: 1px solid #d6d6d6;
	--editor: trasparent;
	--code: #efefef;
	--code-color: var(--color);
	--placeholder: rgba(90, 90, 90, 0.836);
	--link: rgb(0, 157, 230);
	--navbar: white;
	--navbar-color: #212529;
	--navbar-dropdown-hover: #ececec;
	--wrapper-background: var(--navbar);
	--input-group-bg: #d6d6d6;
	--input-group-color: #444444;
	--input-group-border: #b1b1b1 1px solid;
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



