const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    local :{
        email: String,
        password: String
    },
    messageThreads: Array,
    showEmail: Boolean,
    firstName: String,
    lastName: String,
    location: {
        city: String,
        state: String
    },
    phone: String,
    roles: Array,           // Possible values: 'contractor', 'hirer', 'admin'
    skills: Array,          // Array of id's from the Skills collection
    posts: Array,        // Array of ids from the Postings collection
    // Meta data
    _accountCreated: Date
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
