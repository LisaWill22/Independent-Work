var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    local :{
        email: String,
        password: String
    },
    firstName: String,
    lastName: String,
    phone: String,
    roles: Array,           // Possible values: 'contractor', 'hirer', 'admin'
    skills: Array,          // Array of id's from the Skills collection
    postings: Array,        // Array of ids from the Postings collection
    // Meta data
    _accountCreated: Date,
    _lastLogin: Date
}, { strict: false });

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

exports.User = mongoose.model('User', userSchema);
