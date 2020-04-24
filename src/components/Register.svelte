<script>
import {instance} from '../modules/Requests.js';
import { onMount } from "svelte";
import { host } from '../modules/Options.js';

let username = '', realname = '', email = '', password = '', password_check = '', register, email_c, password_c, realname_c;
let user_check = false, password_check_c = false, email_check = false;
let register_check = '';
let l_modal;
let r_modal;

async function CheckUsername(){
    const res = await instance.get('api/register/check/username/'+username, { progress: false }).then(function (response) {
            return response.data;
        });
    const json = await res;
    if (json.check){
        register.setCustomValidity("Username Taken");
        register.focus();
        register.classList.add('error');
        register.reportValidity();
        user_check = false;
    }
    else{
        register.setCustomValidity("");
        register.classList.remove('error');
        user_check = true;
    }
};

async function CheckEmail(){
    const res = await instance.get('/api/register/check/email/'+email, { progress: false }).then(function (response) {
            return response.data;
        });
    const json = await res;
    if (json.check){
        email_c.setCustomValidity("Email Taken");
        email_c.focus();
        email_c.classList.add('error');
        email_c.reportValidity();
        email_check = false;
    }
    else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false){
        email_c.setCustomValidity("Please match the format");
        email_c.focus();
        email_c.classList.add('error');
        email_c.reportValidity();
        email_check = false;
    }
    else{
        email_c.setCustomValidity("");
        email_c.classList.remove('error');
        email_check = true;
    }
};
async function CheckPassword(){
    if (password != password_check){
        password_c.setCustomValidity("Passwords doesn't match");
        password_c.focus();
        password_c.classList.add('error');
        password_c.reportValidity();
        password_check_c = false;
    }else{
        password_c.setCustomValidity("");
        password_c.classList.remove('error');
        password_check_c = true;
    }
};

async function RegisterUser(){
    if (!user_check){
        register.classList.add('error');
        register.reportValidity();
        return;
    }
    if(!realname){
        realname_c.classList.add('error');
        realname_c.reportValidity();
        return;
    }
    if (!email_check){
        email_c.classList.add('error');
        email_c.reportValidity();
        return;
    }
    if (!password_check_c){
        password_c.classList.add('error');
        password_c.reportValidity();
        return;
    }
    const res = await instance.post('/api/register' ,{ username: username, email: email, realname: realname, password: password }).then(function (response) {
            return response.data;
        });
    const json = await res;
    register_check = json.register;

}

onMount(async function() {
    l_modal = document.getElementById("login-modal");
});


function CloseModal(){
    if (r_modal.style["opacity"] < 1){
        r_modal.style["visibility"] = "visible";
        r_modal.style["opacity"] = 1;
        r_modal.style["pointer-events"] = "auto";
    }else{
        r_modal.style["visibility"] = "hidden";
        r_modal.style["opacity"] = 0;
        r_modal.style["pointer-events"] = "none";
    }
}

function OpenLogin(){
    r_modal.style["visibility"] = "hidden";
    r_modal.style["opacity"] = 0;
    r_modal.style["pointer-events"] = "none";
    l_modal.style["visibility"] = "visible";
    l_modal.style["opacity"] = 1;
    l_modal.style["pointer-events"] = "auto";
}

function handleKeydown(event) {
  if (event.keyCode == 13){
    RegisterUser()
  }
}
</script>

<modal id="register-modal" bind:this={r_modal}>
    <div class="modal" on:keydown={handleKeydown} id="register-modal-inner">
        <span on:click={CloseModal} class="close-modal" style='font-size: 0.7rem;cursor:pointer;'>Close</span>
        <div class="modal-header">
        {#if register_check == ''}
            <img style="vertical-align: middle;" onerror="this.style.display='none'" data="/static/logo.svg" width="70"
                alt="">
            <br>
            <span style="color:var(--color)"><span style="color:#18BC9C;">New</span>App - Register</span>
        {:else if register_check == 'success'}
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#18BC9C" stroke-width="6" stroke-miterlimit="10" cx="65.1"
                    cy="65.1" r="62.1" />
                <polyline class="path check" fill="none" stroke="#18BC9C" stroke-width="6" stroke-linecap="round"
                    stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
            </svg>
        {/if}
        </div>
        {#if register_check == ''}
            <div class="modal-content">
                <input id="register_username" name="register_username" placeholder="Username/Email" required="true" type="text" bind:value={username} on:change={CheckUsername} bind:this={register}>
                <input id="register_realname" name="register_realname" placeholder="Real Name" required="true" type="text" bind:this={realname_c} bind:value={realname}>
                <input id="register_email" name="register_email" placeholder="Email" required="true" type="text" bind:value={email} on:change={CheckEmail} bind:this={email_c}>
                <input id="register_password" name="register_password" placeholder="Password" required="true" type="password" bind:value={password} bind:this={password_c}>
                <input id="register_confirm_password" name="register_confirm_password" placeholder="Confirm Password" required="true" type="password" bind:value={password_check} on:change={CheckPassword}>
            </div>
            <div class="modal-footer">
                <span style="font-size: 0.6rem;color:var(--color);">Already have an account? <span style="color:#18BC9C;cursor:pointer;" on:click={OpenLogin}>Login here</span></span>
                <button type="submit" class="modal-button" on:click={RegisterUser}>Register</button>
            </div>
        {:else if register_check == 'success'}
            <div class="modal-content">
                <p class="success">Email Sent!</p>
                <p class="lead">We have sent you an email for confirm your action on this website, got to check your mail box for continue your action.</p>
            </div>
            <div class="modal-footer">
                <button type="submit" class="modal-button" on:click={() => {register_check = '';CloseModal()}}>Home</button>
            </div>
        {/if}
    </div>
</modal>

<style>
svg {
        width: 100px;
        display: block;
        margin: -1% auto 0;
    }

    .path {
        stroke-dasharray: 1000;
        stroke-dashoffset: 0;
    }

    .path.circle {
        -webkit-animation: dash 0.9s ease-in-out;
        animation: dash 0.9s ease-in-out;
    }

    .path.check {
        stroke-dashoffset: -100;
        -webkit-animation: dash-check 0.9s 0.35s ease-in-out forwards;
        animation: dash-check 0.9s 0.35s ease-in-out forwards;
    }

    p.success {
        text-align: center;

        font-size: 1.25em;
    }

    p.success {
        color: #18BC9C;
    }

    p.lead {
        color: var(--color);
    }

    @-webkit-keyframes dash {
        0% {
            stroke-dashoffset: 1000;
        }

        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes dash {
        0% {
            stroke-dashoffset: 1000;
        }

        100% {
            stroke-dashoffset: 0;
        }
    }

    @-webkit-keyframes dash-check {
        0% {
            stroke-dashoffset: -100;
        }

        100% {
            stroke-dashoffset: 900;
        }
    }

    @keyframes dash-check {
        0% {
            stroke-dashoffset: -100;
        }

        100% {
            stroke-dashoffset: 900;
        }
    }
</style>

