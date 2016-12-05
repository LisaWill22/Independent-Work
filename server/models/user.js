const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    local :{
        email: String,
        password: String
    },
    image: Object,
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatThread'
        }
    ],
    showEmail: Boolean,
    firstName: String,
    lastName: String,
    location: {
        city: String,
        state: String,
        zipcode: String
    },
    phone: String,
    roles: Array,           // Possible values: 'contractor', 'hirer', 'admin'
    skills: [{
		type: Schema.Types.ObjectId,
		ref: 'Skill'
    }],
    posts: Array,        // Array of ids from the Postings collection
    // Meta data
    _accountCreated: Date,
    _resetPasswordToken: String,
    _resetPasswordExpires: Date
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
