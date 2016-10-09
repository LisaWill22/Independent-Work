var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String;
    password: String;
    firstName: String;
    lastName: String;
    phonenumber: String;
    roles: Array;           // Possible values: 'contractor', 'hirer', 'admin'
    skills: Array;          // Array of id's from the Skills collection
    postings: Array;        // Array of ids from the Postings collection
    // Meta data
    _accountCreated: Date;
    _lastLogin: Date;
}, { strict: false });

exports.User = mongoose.model('User', userSchema);
