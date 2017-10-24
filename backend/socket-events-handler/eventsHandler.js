/**
 * This class configures and handles socketio events
 */
'use strict';
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

/**
 * Defines event listeners
 * @param io
 * @param store - redis store will store user and socket details across service instances
 */
const events = function (io, store) {
    io.on('connection', function (socket) {
        socket.on('setNick', function(data) {
            store.hget('users', data.nickname, (err, nickname) => {
                if(err) console.log(err);
                else{
                    if(!nickname){
                        //store nickname and map to socket id - this will be used to retreive socket id
                        //for private messages
                        store.hset('users', data.nickname, socket.id, (err, user) => {
                            if (err) console.log(err);
                        });
                        //store socket and map to nickname - this will be used to retreive nickname
                        //when user disconnects
                        store.hset('sockets', socket.id, data.nickname, (err, socket) => {
                            if (err) console.log(err);
                        });
                        socket.emit('nickSet');
                    }
                    else socket.emit('nickExists');
                }
            })
        });

        //join chat
        socket.on('join', function (data) {
            socket.join();
            //get all previously registered users
            store.hgetall('users', (err, users) => {
                if (err) console.log(err);
                else {
                    let nicknames = [];
                    if(users){
                         nicknames = Object.keys(users).filter(nickname => nickname !== data.nickname);
                    }
                    //send nicknames list to new user
                    socket.emit('nicknameList', nicknames);
                    //send nickname to all previously registered users
                    socket.broadcast.emit('userJoined', data);
                }
            });
        });

        //send new private/public message
        socket.on('newMsg', function (data) {
            //if specific nickname is not empty (to)...
            if (data.to) {
                //... get that nickname's socket id and ...
                store.hmget('users', data.to, (err, socketId) => {
                    // ... if no error occurred...
                    if (err) console.log(err);
                    // ... send a private message to nickname ..
                    else if(socketId) socket.broadcast.to(socketId[0]).emit('newMsg', data);
                })
                //.. else send a public message to all connected users
            } else {
                socket.broadcast.emit('newMsg', data);
            }
        });

        // When a socket exits
        socket.on('disconnect', function () {
            //get nickname by socket id
            store.hget('sockets', socket.id, (err, nickname) => {
                if(err) console.log(err);
                //if nickname found ...
                else if(nickname){
                    //... delete user mappings from store
                    store.hdel('users', nickname, (err, result) =>{
                        if(err) console.log(err);
                    });
                    store.hdel('sockets', socket.id, (err, result) =>{
                        if(err) console.log(err);
                    });
                    socket.broadcast.emit('userLeft', {'nickname': nickname});
                }
            });
        });
    });
};

const init = function (io) {
    let config = require('../config/config');
    setupAdapter(config, io);

    let store = redis(config.redis.port, config.redis.host, {auth_pass: config.redis.password});

    events(io, store);
};

/**
 * setup redis adapter
 * @param config
 * @param io
 */
const setupAdapter = function (config, io) {
    let port = config.redis.port;
    let host = config.redis.host;
    let password = config.redis.password;
    let pubClient = redis(port, host, {auth_pass: password});
    let subClient = redis(port, host, {auth_pass: password, return_buffers: true,});
    io.adapter(adapter({pubClient, subClient}));
};

module.exports = init;