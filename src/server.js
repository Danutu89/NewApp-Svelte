import sirv from 'sirv';
import {instance} from './modules/Requests.js';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
var jwt_decode = require('jwt-decode');

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }), 
		sirv('static', { dev }),
		async (req, res, next) => {
			const cookies = require('cookie-universal')(req, res);
			if(cookies.get('token')){
				var decoded = jwt_decode(cookies.get('token'));
				instance.defaults.headers.common['Token']= cookies.get('token');
				req.name = decoded.name;
				req.avatar = decoded.avatar;
				req.id = decoded.id;
				req.token = cookies.get('token');
				req.real_name = decoded.realname;
				req.permissions = decoded.permissions;
				req.theme = decoded.theme;
				req.theme_mode = decoded.theme_mode;
				req.auth = true;
			}else{
				instance.defaults.headers.common['Token']= '';
				req.name = '';
				req.avatar = '';
				req.id = null;
				req.token = '';
				req.real_name = '';
				req.permissions = {};
				req.auth = false;
			}
			next();
		},
		sapper.middleware({
			session: (req, res) => ({
				name: req.name,
				id: req.id,
				avatar: req.avatar,
				token: req.token,
				real_name: req.real_name,
				permissions: req.permissions,
				theme: req.theme,
				theme_mode: req.theme_mode,
				auth: req.auth

			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
