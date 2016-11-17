var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    // a user id
    sender: Object,
    recipient: Object,
    // some message content
    message: String,
    // controls flagging if user has unread messages
    unread: Boolean,
    // some meta data
    _dateSent: Date,
    _dateRead: Date
})

exports.Chat = mongoose.model('Chat', chatSchema);
