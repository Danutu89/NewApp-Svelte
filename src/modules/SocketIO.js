const socketio = require('socket.io-client')

export const socket = socketio.connect("https://newapp.nl/",{transports: ['websocket','polling']});
