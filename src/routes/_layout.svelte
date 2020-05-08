<script>
import {onMount, beforeUpdate} from 'svelte'
import Nav from '../components/Nav.svelte';
import { loadProgressBar } from 'axios-progress-bar';
import { stores } from '@sapper/app';
const { page, session } = stores();
import Analytics from '../modules/Analytics.js';
import SideBarAdmin from '../components/SideBarAdmin.svelte';
import Alert from '../components/Alert.svelte';
export let segment;
import {host} from '../modules/Options.js';
import {instance} from '../modules/Requests.js';
import { alert } from '../modules/Alert.js';

let admin = false;
let analytics = new Analytics;

let tStart;
let tCurrent;

let reload;

var path = segment;
try {
	if(path.includes('/admin/')){
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
		var data = image.getAttribute("data");
		var data_m = String(data).replace("https://newapp.nl", host);
		image.setAttribute('src', data_m);
	});
}

async function CheckNotification(id){
    if($session.auth == false){
        return;
    }
    const not = await instance.get(+"/api/notifications/check?not_id="+id).then(response =>{
        if(response.status != 200){
            //alert
            return;
        }

        if(response.data['operation'] != "success"){
            //alert
            return;
        }

        return;
    })
}

function swipeStart(e){
	tStart =  {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};
}

function swipe(e){
	tCurrent = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};
	var changeY = Math.abs(tStart.y - tCurrent.y);
	var rotation = changeY < 100 ? changeY * 30/10 : 30;
	if(document.body.scrollTop == 0){
		reload.style.height = 'calc(3rem + '+changeY+'px)';
		reload.style.transform = 'translateY('+changeY+'px)';
		reload.children[0].style.transform = 'rotate('+rotation+'deg)';
		if(changeY > 100){
			reload.children[0].style["-webkit-animation"] = "load8 1.1s infinite linear";
			reload.children[0].style["animation"] = "load8 1.1s infinite linear";
		}
	}
}

function swipeEnd(){
	reload.style.height = '';
	reload.style.transform = '';
	reload.children[0].style.transform = '';
}

beforeUpdate(async function(){
	if ($session.auth){
		instance.defaults.headers.common['Token'] = $session.token;
	}else{
		instance.defaults.headers.common['Token'] = '';
	}
    // if($page.query.notification_id){
    //     CheckNotification($page.query.notification_id);
    // }
})

onMount(async function() {
	// if($page.query.notification_id){
    //     CheckNotification($page.query.notification_id);
	// }
	document.addEventListener("touchstart", swipeStart);
	document.addEventListener("touchmove", swipe);
	document.addEventListener("touchend", swipeEnd);
	loadProgressBar('', instance);
	if($session.auth){
		
		document.querySelector("html").setAttribute("theme", $session.theme);			
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
	}else{
		if(window.matchMedia('(prefers-color-scheme: dark)').matches){
			document.querySelector("html").setAttribute("theme", "Dark");
		}else{
			document.querySelector("html").setAttribute("theme", "Light");
		}
	}
	lazyLoad();
	document.addEventListener('DOMSubtreeModified', lazyLoad);
	//analytics.init(true);
	let url = location.href;
	// document.body.addEventListener('click', ()=>{
	// 	requestAnimationFrame(()=>{
	// 	if(url!==location.href){
	// 		analytics.validate();
	// 		analytics.init(false);
	// 	};
	// 	url = location.href;
	// 	});
	// }, true);
	
});

beforeUpdate(async function(){
	var path = location.pathname;
	if(path.includes('admin')){
		admin = true;
	}else{
		admin = false;
	}
	if($session.auth)
		document.querySelector("html").setAttribute("theme", $session.theme);
	else{
		if(window.matchMedia('(prefers-color-scheme: dark)').matches){
			document.querySelector("html").setAttribute("theme", "Dark");
		}else{
			document.querySelector("html").setAttribute("theme", "Light");
		}
	}
});
</script>

<Nav admin={admin}/>

{#if admin == false}
<reload bind:this={reload} style="display:block"><div class="loader"></div></reload>
{:else}
<reload bind:this={reload} style="height: 2.7rem;display:block"><div class="loader"></div></reload>
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

{#if $alert.active == true}
<Alert/>
{/if}

