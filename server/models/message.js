var mongoose = require('mongoose');

var messageShema = new mongoose.Schema({
    // a user id
    sender: String;
    receiver: String;
    message: String;
    _dateSent: Date;
    _dateRead: Date;
})

exports.Message = mongoose.model('Message', messageSchema)
