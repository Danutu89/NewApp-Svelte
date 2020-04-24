export let preloads = {
    pages: {},
    setPath: (path)=>{
        this.pages[path]={loaded: false}
    },
    setLoaded: (path)=>{
        this.pages[path]={loaded: true}
    },
    getPage: (path)=>{
        try {
            return this.pages[path];
        } catch (error) {
            return false;
        }
        
    }
};