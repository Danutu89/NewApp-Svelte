<script>
import {onMount, beforeUpdate} from 'svelte'
import Nav from '../components/Nav.svelte';
import { loadProgressBar } from 'axios-progress-bar';
import { stores } from '@sapper/app';
const { session } = stores();
import Analytics from '../modules/Analytics.js';
import {socketio} from '../modules/SocketIO';
import SideBarAdmin from '../components/SideBarAdmin.svelte';
export let segment;

let admin = false;
let analytics = new Analytics;

var path = segment;
try {
	if(path.includes('admin')){
		admin = true;
	}else{
		admin = false;
	}
} catch (error) {
	admin = false;
}

function lazyLoad(){
	var img = document.querySelectorAll("img");
	img.forEach(image => {
		image.setAttribute('src', image.getAttribute("data"));
	});
}

onMount(async function() {
	loadProgressBar();
	if($session.auth){
		document.querySelector("html").setAttribute("theme", $session.theme);
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
	lazyLoad();
	document.addEventListener('DOMSubtreeModified', lazyLoad);
	analytics.init(true);
	let url = location.href;
	document.body.addEventListener('click', ()=>{
		requestAnimationFrame(()=>{
		if(url!==location.href){
			analytics.validate();
			analytics.init(false);
		};
		url = location.href;
		});
	}, true);
});

beforeUpdate(async function(){
	var path = location.pathname;
	if(path.includes('admin')){
		admin = true;
	}else{
		admin = false;
	}
	document.querySelector("html").setAttribute("theme", $session.theme);
});
</script>

<Nav admin={admin}/>

{#if admin == false}
<reload style="display:block"></reload>
{:else}
<reload style="height: 2.7rem;display:block"></reload>
{/if}

<overflow></overflow>

{#if admin == false}

<content>
	<slot></slot>
</content>

{:else}

<a-content>
	<SideBarAdmin/>
	<slot></slot>
</a-content>

{/if}

