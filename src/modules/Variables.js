export let wrapper = {
    opened: true,
    setTrue: function (sidebar,overflow){
        sidebar.classList.remove("toggled");
        overflow.classList.remove("show");
        this.opened = true;
    },
    setFalse: function(sidebar,overflow){
        sidebar.classList.add("toggled");
        overflow.classList.add("show");
        this.opened = false;
    }
};