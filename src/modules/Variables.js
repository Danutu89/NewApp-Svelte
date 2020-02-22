export let wrapper = {
    opened: true,
    setTrue: function (sidebar,overflow,navbar){
        sidebar.classList.remove("toggled");
        overflow.classList.remove("show");
        navbar.classList.add("shadow");
        this.opened = true;
    },
    setFalse: function(sidebar,overflow,navbar){
        sidebar.classList.add("toggled");
        overflow.classList.add("show");
        navbar.classList.remove("shadow");
        this.opened = false;
    }
};