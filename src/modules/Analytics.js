import axios from "axios";
import { host } from '../modules/Options.js';

export default class Analytics{
    constructor(){
        this.time_new = null;
        this.time_old = null;
    }

    init() {
        this.time_old = Date.now();
    }

    validate(){
        this.time_new = Date.now()
        let time = this.time_new - this.time_old;

        if(time < 2000)
            return;

        this.sendView();
    }

    sendView(){
        let path = location.pathname;
        axios.post(host+'/api/analytics/view', {path: path});
    }
}