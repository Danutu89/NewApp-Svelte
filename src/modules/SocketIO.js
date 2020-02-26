import io from 'socket.io-client';

export const socketio = io.connect("https://newapp.nl/",{transports: ['websocket','polling']});
