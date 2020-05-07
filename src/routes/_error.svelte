<style>
/* Error Page */
    .error .clip .shadow
    {
        height: 180px;  /*Contrall*/
    }
    .error .clip:nth-of-type(2) .shadow
    {
        width: 130px;   /*Contrall play with javascript*/ 
    }
    .error .clip:nth-of-type(1) .shadow, .error .clip:nth-of-type(3) .shadow
    {
        width: 250px; /*Contrall*/
    }
    .error .digit
    {
        width: 150px;   /*Contrall*/
        height: 150px;  /*Contrall*/
        line-height: 150px; /*Contrall*/
        font-size: 120px;
        font-weight: bold;
    }
    .error h2   /*Contrall*/
    {
        font-size: 32px;
    }

    .text-center {
        text-align:center;
    }

    .error .container-error-404
    {
      margin-top: 10%;
        position: relative;
        height: 250px;
        padding-top: 40px;
    }
    .error .container-error-404 .clip
    {
        display: inline-block;
        transform: skew(-45deg);
    }
    .error .clip .shadow
    {
        
        overflow: hidden;
    }
    .error .clip:nth-of-type(2) .shadow
    {
        overflow: hidden;
        position: relative;
        box-shadow: inset 20px 0px 20px -15px rgba(150, 150, 150,0.8), 20px 0px 20px -15px rgba(150, 150, 150,0.8);
    }
    
    .error .clip:nth-of-type(3) .shadow:after, .error .clip:nth-of-type(1) .shadow:after
    {
        content: "";
        position: absolute;
        right: -8px;
        bottom: 0px;
        z-index: 9999;
        height: 100%;
        width: 10px;
        background: linear-gradient(90deg, transparent, rgba(173,173,173, 0.8), transparent);
        border-radius: 50%;
    }
    .error .clip:nth-of-type(3) .shadow:after
    {
        left: -8px;
    }
    .error .digit
    {
        position: relative;
        top: 8%;
        color: white;
        background: rgb(34, 34, 34);
        border-radius: 50%;
        display: inline-block;
        transform: skew(45deg);
    }
    .error .clip:nth-of-type(2) .digit
    {
        left: -10%;
    }
    .error .clip:nth-of-type(1) .digit
    {
        right: -20%;
    }.error .clip:nth-of-type(3) .digit
    {
        left: -20%;
    }    
    .error h2
    {
        color: #A2A2A2;
        font-weight: bold;
        padding-bottom: 20px;
        text-align: center;
    }

/* Error Page */
@media(max-width: 767px)
{
    /* Error Page */
            .error .clip .shadow
            {
                height: 100px;  /*Contrall*/
            }
            .error .clip:nth-of-type(2) .shadow
            {
                width: 80px;   /*Contrall play with javascript*/ 
            }
            .error .clip:nth-of-type(1) .shadow, .error .clip:nth-of-type(3) .shadow
            {
                width: 100px; /*Contrall*/
            }
            .error .digit
            {
                width: 80px;   /*Contrall*/
                height: 80px;  /*Contrall*/
                line-height: 80px; /*Contrall*/
                font-size: 52px;
            }
            .error h2   /*Contrall*/
            {
                font-size: 24px;
            }
.error .container-error-404
  {
    height: 150px;
  }
        /* Error Page */
}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>


<div class="error" style="margin: auto;">
        <div class="container-floud">
            <div class="col-xs-12 ground-color text-center">
                <div class="container-error-404">
                    <div class="clip"><div class="shadow"><span class="digit firstDigit"></span></div></div>
                    <div class="clip"><div class="shadow"><span class="digit secondDigit"></span></div></div>
                    <div class="clip"><div class="shadow"><span class="digit thirdDigit"></span></div></div>
                </div>
                <h2 class="h1">{error.message}</h2>
				{#if dev && error.stack}
					<pre>{error.stack}</pre>
				{/if}
            </div>
        </div>
    </div>

<script>
	import { onMount } from 'svelte';
	export let status;
	export let error;
	let loop1,loop2,loop3,time=30, i=0, number, selector3, selector1, selector2 ;
	const dev = process.env.NODE_ENV === 'development';
    function randomNum()
        {
            "use strict";
            return Math.floor(Math.random() * 9)+1;
        }
            

	onMount(async function(){
		time=30, i=0, selector3 = document.querySelector('.thirdDigit'), selector2 = document.querySelector('.secondDigit'),
				selector1 = document.querySelector('.firstDigit');
		loop3 = setInterval(function()
            {
              "use strict";
                if(i > 40)
                {
                    clearInterval(loop3);
                    selector3.innerHTML = (''+status)[2];

                }else
                {
                    selector3.innerHTML = randomNum();
                    i++;
                }
            }, time);
            loop2 = setInterval(function()
            {
              "use strict";
                if(i > 60)
                {
                    clearInterval(loop2);
                    selector2.innerHTML = (''+status)[1];
                }else
                {
                    selector2.innerHTML = randomNum();
                    i++;
                }
            }, time);
            loop1 = setInterval(function()
            {
              "use strict";
                if(i >= 80)
                {
                    clearInterval(loop1);
                    selector1.innerHTML = (''+status)[0];
                    

                }else
                {
                    selector1.innerHTML = randomNum();
                    i++;
                }
            }, time);
		
	})
            
</script>
