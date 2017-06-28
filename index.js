/**
 * Created by GAZ on 6/28/17.
 */
'use strict';

/**
 * Module exports.
 * @public
 */

var clients = {};

exports.client = client;
exports.server = server;
exports.clients = clients;

function client(options){
    if (typeof options !== 'object') {
        throw new TypeError('argument options must be an object');
    }
    if (typeof options.meta !== 'object') {
        throw new TypeError('argument options.meta must be an object');
    }
    if (typeof options.endpoint !== 'string') {
        throw new TypeError('argument options.endpoint must be a string');
    }
    if (typeof options.namespace !== 'string') {
        throw new TypeError('argument options.namespace must be a string');
    }

    var socket = require('socket.io-client').connect(options.endpoint + options.namespace);
    socket.on('connect',function(){
        socket.emit('meta', options.meta, (data) => {});
    })
    return socket;
}

function server(options){
    if (typeof options !== 'object') {
        throw new TypeError('argument options must be an object');
    }
    if (typeof options.namespace !== 'string') {
        throw new TypeError('argument options.namespace must be a string');
    }
    if (!options.port || (typeof options.port !== 'string' && typeof options.port !== 'number')) {
        throw new TypeError('argument options.port must be a string or number');
    }

    var socket = require('socket.io').listen(options.port);
    var nsp = socket.of(options.namespace);

    nsp.on('connection', (socket) => {
        clients[socket.id] = {connected:true};
        socket.on('disconnect', (reason) => {
            clients[socket.id].connected = false;
        });
        socket.on('meta', (data, cb) => {
            clients[socket.id].meta = data;
            cb('done');
        });
    });

    return nsp;
}