// test/test.js
const expect = require('chai').expect;
const io     = require('socket.io-client');
const http = require('http');

const app = require('../app');

const port = '3000';
const host = 'localhost';

//setup and start server
app.set('port', port);
const server = http.createServer(app);
app.io.attach(server);
server.listen(port);

const socketServerURI = 'http://' + host + ':' + port;

const options = {
    transports: ['websocket'],
    'force new connection': true
};



describe('Sockets', function () {
    let client1, client2, client3;

    it('should send and receive a message', function (done) {
        // Set up client1 connection
        client1 = io.connect(socketServerURI, options);

        // Set up event listener.  This is the actual test we're running
        client1.on('newMsg', function(msg){
            expect(msg.message).to.equal('test');

            // Disconnect both client connections
            client1.disconnect();
            client2.disconnect();
            done();
        });

        client1.on('connect', function(){
            client1.emit('setNick', {nickname: 'User1'});
            client1.on('nickSet', () => {
                client1.emit('join', {nickname:'User1'});
            });

            // Set up client2 connection
            client2 = io.connect(socketServerURI, options);

            client2.on('connect', function(){
                client2.emit('setNick', {nickname: 'User2'});
                // Emit event when all clients are connected.
                client2.on('nickSet', () => {
                    client1.emit('join', {nickname:'User2'});
                    client2.emit('newMsg', {nickname:'User2', message:'test'});
                });
            });

        });
    });

    it('should send and receive a message only to users in the same room', function (done) {
        let client2CallCount = 0;
        let client3CallCount = 0;
        // Connect the sending client
        client1 = io.connect(socketServerURI, options);

        client1.on('connect', function(){
            client1.emit('setNick', {nickname: 'User1'});
            client1.on('nickSet', () => {
                client1.emit('join', {nickname:'User1'});
            });

            //Connect the receiving client
            client2 = io.connect(socketServerURI, options);

            client2.on('connect', function(){
                client2.emit('setNick', {nickname: 'User2'});
                client2.on('nickSet', () => {
                    client2.emit('join', {nickname:'User2'});
                });
                //Connect the client that should not receive anything
                client3 = io.connect(socketServerURI, options);

                client3.on('connect', function(){
                    client3.emit('setNick', {nickname: 'User3'});
                    client3.on('nickSet', () => {
                        client3.emit('join', {nickname:'User3'});
                    });
                    client1.emit('newMsg', {to:'User2', nickname:'User1', message:'test'});
                });
                //If this client received means the test failed
                client3.on('newMsg', function(){
                    client3CallCount++;
                });
            });
            //At least this event should happen
            client2.on('newMsg', function(){
                client2CallCount++;
            });
        });

        setTimeout(function(){
            expect(client2CallCount).to.equal(1);
            expect(client3CallCount).to.equal(0);
            client1.disconnect();
            client2.disconnect();
            client3.disconnect();
            done();
        }, 25);
    });
});