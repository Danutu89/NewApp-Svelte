import {instance} from '../modules/Requests.js';
import { host } from '../modules/Options.js';

export default class Analytics{
    constructor(){
        this.time_new = null;
        this.time_old = null;
        this.external = false;
    }

    init(external) {
        this.time_old = Date.now();
        this.external = external;
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
        instance.post(host+'/api/analytics/view', {path: path,external: this.external});
    }
}