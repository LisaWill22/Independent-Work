// const express = require('express');
// const router = express.Router();
// const Chat = require('../models/chat').Chat;
// const io = require('../../server');
//
// router.route('/')
// 	.post(function(req, res, next) {
// 		// Create new chat model
// 		const newChat = new Chat(req.body);
// 		// Save the chat to mongo
// 		newChat.save(function(err, chat) {
// 			if (err) {
// 				console.log(err);
// 				return res.send(err);
// 			}
// 			console.log(chat);
// 			// Emit the message
// 			io.sockets.emit('chat message', chat);
// 			// Return the chat
// 			return res.send(chat);
// 		});
// 	});
//
// module.exports = router;
