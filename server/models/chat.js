const mongoose = require('mongoose');
const Schema = mongoose.Schema

const chatSchema = new mongoose.Schema({
	// a user id
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	// sender user
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	// some message content
	message: String,
	// controls flagging if user has unread messages
	unread: Boolean,
	// some meta data
	_dateSent: Date,
	_dateRead: Date
})

exports.Chat = mongoose.model('Chat', chatSchema);
