<script>
import { onMount } from 'svelte';

let swipeDir = "none";
let elementSwiped = "none";
let touchStart, touchCurrent, touchEnd;
let touchLive = [];
let touchPosStart;
let swipeThreshold = 20;
let swipeLenght = 1;
let touchThreshold = 10;
let touchDistance = 3;
let change;

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

    touchLive.push(touchStart);
}

function swipeMove(e){
    if(typeof(e.targetTouches[0]) == "undefined")
        touchCurrent = {x: e.screenX, y: e.screenY};
    else
        touchCurrent = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};

    change = {x: (touchStart.x - touchCurrent.x)*-1, y: (touchStart.y - touchCurrent.y)*-1};

    if(typeof(touchLive[touchLive.length - touchDistance]) == "undefined"){
        touchLive.push(touchCurrent);
        swipeDir = "none";
        return;
    }

    if (Math.abs(touchCurrent.x - touchLive[touchLive.length - touchDistance].x) > swipeLenght && Math.abs(touchCurrent.y - touchLive[touchLive.length - touchDistance].y) < swipeThreshold){
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
    }else if(Math.abs(touchCurrent.y - touchLive[touchLive.length - touchDistance].y) > swipeLenght && Math.abs(touchCurrent.x - touchLive[touchLive.length - touchDistance].x) < swipeThreshold){
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
    }

    if(swipeDir == "right" && touchPosStart.x < window.innerWidth/4){
        if(typeof(sidebar) != "undefined"){
            elementSwiped = "wrapper";
            dragWrapper(e);
        }
    }else if(swipeDir == "left"){
        if(typeof(sidebar) != "undefined" && elementSwiped == "wrapper" || sidebarOpened){
            dragWrapper(e);
            elementSwiped = "wrapper";
        }
    }else if(touchPosStart.y < window.innerHeight/5 && document.body.scrollTop == 0 && window.scrollY == 0 && swipeDir == "down" || swipeDir == "up"){
        if(typeof(reload) != "undefined"){
            elementSwiped = "reload";
            dragReload(e);
        }
    }else if(swipeDir == "up" && touchPosStart.y > (window.innerHeight - window.innerHeight/5)){
        elementSwiped = "bottom bar";
    }else{
        elementSwiped = "none";
    }
}

function swipeEnd(e){
    if(typeof(e.targetTouches[0]) == "undefined")
        touchEnd = {x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
    else
        touchEnd = {x: e.targetTouches[0].screenX, y: e.targetTouches[0].screenY};

    var isTouch = Math.abs(touchEnd.y - touchStart.y) < touchThreshold && Math.abs(touchEnd.x - touchStart.x) < touchThreshold ? true : false;

    if(isTouch)
        swipeDir = "touch";

    if(typeof(sidebar) != "undefined" && !isTouch){
        sidebar.style.transition = "";
        var tranX = sidebar.style.transform;
        tranX = tranX.replace(/[^\d.]/g, '');
        tranX = Math.abs(parseInt(tranX));
        if(tranX != 20 && tranX != 290){
            if( Math.abs(tranX - 20) > Math.abs(tranX - 290)){
                sidebar.style.transform = "translateX(-290px)";
                sidebarOpened = false;
                overflow.classList.remove("show");
            }else{
                sidebar.style.transform = "translateX(-20px)";
                sidebarOpened = true;
                overflow.classList.add("show");
            }
        }
        //console.log(Math.abs(tranX - 20),Math.abs(tranX - 290))
    }
    //console.log(swipeDir, elementSwiped);
    //console.log(isTouch);
    touchLive = [];
    swipeDir = "none";
    elementSwiped = "none";
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
    
}

onMount(()=>{
    document.addEventListener("touchstart", swipeStart);
    document.addEventListener("touchmove", swipeMove);
    document.addEventListener("touchend", swipeEnd);

    overflow = document.querySelector("overflow");

    //wrapper req
    sidebar = document.getElementById("sidebar-left");
    navbar = document.querySelector(".newapp-navbar");

    //reload req
    reload = document.querySelector("reload");
    reloadHeight = parseFloat((getComputedStyle(reload).minHeight).replace(/[^\d.]/g, ''));;

});
</script>