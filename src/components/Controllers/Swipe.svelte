<script>
import { onMount, beforeUpdate } from 'svelte';
import { lPage } from '../../modules/Preloads.js';

let swipeDir = "none";
let elementSwiped = "none";
let touchStart, touchCurrent, touchEnd;
let touchLive = [];
let touchPosStart;
let swipeThreshold = 4;
let touchThreshold = 10;
let touchDistance = 5;
let change;
let elementOpened = "none";

let overflow;

//wrapper req
let sidebar, navbar, sidebarOpened = false;

//reaload req
let reload, reloadHeight;

function swipeStart(e){
    if(typeof(e.targetTouches[0]) == "undefined"){
        touchStart = {x: e.screenX, y: e.screenY};
        touchPosStart = {x: e.clientX, y: e.clientY};
    }
    else{
        touchStart = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};
        touchPosStart = {x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY};
    }
    if(typeof(sidebar) != "undefined"){
        sidebar.style.transition = "none";
    }
    if(typeof(reload) != "undefined"){
        reload.style.transition = "none";
    }
    document.body.style.overflow = 'hidden';
    touchLive.push(touchStart);
}

function swipeMove(e){
    if(typeof(e.targetTouches[0]) == "undefined")
        touchCurrent = {x: e.screenX, y: e.screenY};
    else
        touchCurrent = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};

    change = {x: (touchStart.x - touchCurrent.x)*-1, y: (touchStart.y - touchCurrent.y)*-1};

    if(typeof(touchLive[touchLive.length - touchDistance]) != "object"){
        touchLive.push(touchCurrent);
        swipeDir = "none";
        //touchStart = touchCurrent;
        return;
    }
    if (Math.abs(touchCurrent.x - touchLive[touchLive.length - touchDistance].x) > swipeThreshold && Math.abs(touchCurrent.y - touchLive[touchLive.length - touchDistance].y) < swipeThreshold){
        if(touchCurrent.x - touchLive[touchLive.length - touchDistance].x < 0){
            if(swipeDir != "left"){
                touchLive = [];
            }
            swipeDir = "left";
            touchLive.push(touchCurrent);
        }else{
            if(swipeDir != "righ"){
                touchLive = [];
            }
            swipeDir = "right";
            touchLive.push(touchCurrent);
        }
    }else if(Math.abs(touchCurrent.y - touchLive[touchLive.length - touchDistance].y) > swipeThreshold && Math.abs(touchCurrent.x - touchLive[touchLive.length - touchDistance].x) < swipeThreshold){
        if(touchCurrent.y - touchLive[touchLive.length - touchDistance].y < 0){
            if(swipeDir != "up"){
                touchLive = [];
            }
            swipeDir = "up";
            touchLive.push(touchCurrent);
        }else{
            if(swipeDir != "down"){
                touchLive = [];
            }
            swipeDir = "down";
            touchLive.push(touchCurrent);
        }
    }else{
        swipeDir = "none";
        touchLive = [];
        touchLive.push(touchCurrent);
        return;
    }

    console.log(swipeDir);

    if(swipeDir == "right" && touchPosStart.x < window.innerWidth/4 || swipeDir == "left" && elementOpened == "wrapper"){
        if(typeof(sidebar) != "undefined"&& (elementSwiped == "wrapper" || elementSwiped == "none") && (elementOpened == "wrapper" || elementOpened == "none")){
            elementSwiped = "wrapper";
            elementOpened = "wrapper";
            dragWrapper(e);
        }
    }else if(swipeDir == "left"){
        
    }else if(touchPosStart.y < window.innerHeight/5 && document.body.scrollTop == 0 && window.scrollY == 0 && swipeDir == "down" || swipeDir == "up"){
        if(typeof(reload) != "undefined" && (elementOpened == "none" || elementOpened == "reload") && (elementSwiped == "none" || elementSwiped == "reload")){
            elementSwiped = "reload";
            dragReload(e);
        }
    }else if(swipeDir == "up" && touchPosStart.y > (window.innerHeight - window.innerHeight/5)){
        elementSwiped = "bottom bar";
    }else{
        elementSwiped = "none";
    }
    //console.log(touchStart);
    //console.log(swipeDir, touchLive);
}

async function swipeEnd(e){
    if(typeof(e.targetTouches[0]) == "undefined")
        touchEnd = {x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
    else
        touchEnd = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};

    var isTouch = Math.abs(touchEnd.y - touchStart.y) < touchThreshold && Math.abs(touchEnd.x - touchStart.x) < touchThreshold ? true : false;

    if(isTouch)
        swipeDir = "touch";

    if(typeof(sidebar) != "undefined" && !isTouch && elementSwiped == "wrapper" || elementOpened == "wrapper"){
        sidebar.style.transition = "";
        var tranX = sidebar.style.transform;
        tranX = tranX.replace(/[^\d.]/g, '');
        tranX = Math.abs(parseInt(tranX));
        if(tranX != 20 && tranX != 290){
            if( Math.abs(tranX - 20) > Math.abs(tranX - 290)){
                sidebar.style.transform = "translateX(-290px)";
                elementOpened = "none";
                overflow.classList.remove("show");
            }else{
                sidebar.style.transform = "translateX(-20px)";
                elementOpened = "wrapper";
                overflow.classList.add("show");
            }
        }
        //console.log(Math.abs(tranX - 20),Math.abs(tranX - 290))
    }

    if(elementOpened != "wrapper")
        document.body.style.overflow = 'visible';

    if(typeof(reload) != "undefined" && !isTouch && elementSwiped == "reload" || elementOpened == "reload"){
        reload.style.transition = "";

        if(change.y > 100){
            reload.style["min-height"] = 'calc('+reloadHeight+'px + 60px)';
            reload.style.transform = 'translateY(60px)';
            reload.children[0].style["-webkit-animation"] = "load8 1.1s infinite linear";
            reload.children[0].style["animation"] = "load8 1.1s infinite linear";
            //loading = true;
            elementOpened = "reload";
            await setTimeout(()=>{
                lPage.set({data: $lPage.data, refresh: true});
            }, 400)
        }else{
            reload.style["min-height"] = '';
            reload.style.transform = '';
            reload.children[0].style.display = 'none';
			reload.children[0].style.transform = '';
			reload.children[0].style["-webkit-animation"] = "";
			reload.children[0].style["animation"] = "";
            elementOpened = "none";
        }
    }
    //console.log(change)
    //console.log(swipeDir, elementSwiped);
    //console.log(isTouch);
    touchLive = [];
    swipeDir = "none";
    elementSwiped = "none";
    change = {};
}

function dragWrapper(e){
    var multiplier = 0.9;
    var dragAmount;
    if(swipeDir == "right")
        dragAmount = (-290 + change.x*multiplier);
    else
        dragAmount = (change.x*multiplier);

    if(dragAmount > -290 && dragAmount < -20){
        sidebar.style.transform = "translateX("+dragAmount+"px)";
    }
    if(dragAmount < -20 && dragAmount > -290){
        sidebar.style.transform = "translateX("+dragAmount+"px)";
    }
}

function dragReload(e){
    var reloadHeightD = parseFloat((getComputedStyle(reload).minHeight).replace(/[^\d.]/g, ''));
    var rotation = change.y+10 < 360 ? (change.y+10) * 30/10 : 30;
    var height = reloadHeight + change.y + 30;
	if(document.body.scrollTop == 0 && window.scrollY == 0){
		document.body.style.overflow = 'hidden';
	
        reload.children[0].style.display = 'block';
        elementOpened = "reload";

		if(change.y < 70 ){
            reload.style.transform = 'translateY('+(change.y+30)+'px)';
		}
		if(change.y < 100 || change.y < -30){
            reload.style["min-height"] = height+'px';
		}
		if(change.y < 360){
			reload.children[0].style.transform = 'rotate('+rotation+'deg)';
        }
        
    }
    //console.log(change);
    
}

async function resetLoader(){
	await setTimeout(()=>{
        reload.style["min-height"] = '';
	    reload.style.transform = '';
		reload.children[0].style.display = 'none';
		reload.children[0].style.transform = '';
		reload.children[0].style["-webkit-animation"] = "";
        reload.children[0].style["animation"] = "";
        elementOpened = "none";
	},400)
}

beforeUpdate(()=>{
    overflow = document.querySelector("overflow");

    //wrapper req
    sidebar = document.getElementById("sidebar-left");
    navbar = document.querySelector(".newapp-navbar");

    //reload req
    reload = document.querySelector("reload");
})

onMount(()=>{
    document.addEventListener("touchstart", swipeStart);
    document.addEventListener("touchmove", swipeMove);
    document.addEventListener("touchend", swipeEnd);

    document.addEventListener('reloaded', resetLoader);

    overflow = document.querySelector("overflow");

    //wrapper req
    sidebar = document.getElementById("sidebar-left");
    navbar = document.querySelector(".newapp-navbar");

    //reload req
    reload = document.querySelector("reload");
    reloadHeight = parseFloat((getComputedStyle(reload).minHeight).replace(/[^\d.]/g, ''));

});
</script>