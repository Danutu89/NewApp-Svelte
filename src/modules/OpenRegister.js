function OpenRegister(){
    let r_modal = document.getElementById('register-modal');

    r_modal.style["visibility"] = "visible";
    r_modal.style["opacity"] = 1;
    r_modal.style["pointer-events"] = "auto";
}

export default OpenRegister;