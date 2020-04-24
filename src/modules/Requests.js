import axios from 'axios';
import {host} from './Options.js';

export const instance = axios.create({
    baseURL: host,
    headers: {
      common: {
        Token: ''
      }
    }
});