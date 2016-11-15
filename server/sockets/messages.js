'use strict';

let ChatSocket = (server) => {

	this.server = server;
	this.io = require('socket.io')(this.server);

	this.io.on('connection', (client) => {
		client.broadcast.emit('chat.hi');

		client.on('chat.join', (name) => {
			client.name = name;
			client.broadcast.emit('chat.join', name);
		});

		client.on('chat.typing', () => {
			let message = client.name + ' typing';
			client.broadcast.emit('chat.typing', client.name + ' is typing...');
		});

		client.on('chat.message', (message) => {
			let data = {
				user: client.name,
				text: message,
				date: new Date()
			}
			this.io.emit('chat.message', data);
		});

		client.on('disconnect', () => {
			client.broadcast.emit('chat.leave', client.name);
		});
	});
};

module.exports = ChatSocket;
