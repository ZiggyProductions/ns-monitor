/**
 * Created by GAZ on 6/28/17.
 */
var assert  = require('better-assert');
var expect  = require('expect.js');
//var express = require('express');
var subject = require('./index.js');

describe('Client/Server test for ns-monitor', function(){
    it('should create a server, listen to namespace and return the namespace object', function () {

        var server_options = {
            port: 9999,
            namespace: '/netshards'
        };
        var server = subject.server(server_options);
        server.on('connection', (socket) => {
            socket.on('message', (name, cb) => {
                cb('done');
            });
            socket.on('test', (data) => {
                expect(data).to.be('test');
            });
        });

        expect(server.name).to.be(server_options.namespace);

        describe('Client', function(){
            it('should create a client and connect to server', function () {
                var client_options = {
                    endpoint: "http://localhost:9999",
                    namespace: '/netshards',
                    meta: {key:'value'}
                };
                var nsp = subject.client(client_options);
                var client_id;
                describe('Message', function(){
                    it('should push a message from client to server', function (done) {
                        nsp.on('connect',function(){
                            client_id = nsp.id;
                            nsp.emit('test', 'test');
                            nsp.emit('meta', client_options.meta, (data) => {
                                expect(data).to.be('done');
                            });
                            nsp.emit('message', 'name', (data) => {
                                expect(data).to.be('done');
                                done()
                            });
                        })
                        this.timeout(1000);

                        describe('Clients', function(){
                            it('should detect a presence of connected client in the list of clients', function () {
                                var clients = subject.clients;
                                expect(clients.hasOwnProperty(client_id)).to.be(true);
                                expect(clients[client_id].connected).to.be(true);


                                describe('Meta', function(){
                                    it('should get meadata from server', function () {
                                        expect(clients[client_id].meta.key).to.be('value');
                                    });

                                })

                            });
                        })

                        describe('Disconnection', function(){
                            it('should disconnect the client and ensure it is affected the list of clients', function (cb) {
                                var clients = subject.clients;
                                nsp.disconnect(true);

                                setTimeout(function(){
                                    expect(clients[client_id].connected).to.be(false);

                                    // reconnection test
                                    // var rensp = subject.client(client_options);
                                    //
                                    // setTimeout(function(){
                                    // console.log(clients)
                                    //     cb()
                                    // },200);

                                    cb()
                                },50)

                            });

                        });
                        
                    });

                });
                
            });
            
        });

    });
    
});
