const mongoose = require('mongoose');
const Schema = mongoose.Schema

const chatThreadSchema = new mongoose.Schema({
	// List of user ids involved in the chat
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	// List of chat ids involved in the cdhat
	chats: [{
		type: Schema.Types.ObjectId,
		ref: 'Chat'
	}],
	_dateUpdated: Date,
})

exports.ChatThread = mongoose.model('ChatThread', chatThreadSchema);
