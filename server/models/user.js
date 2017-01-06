'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
const esClient = require('../config/es');

const userSchema = new mongoose.Schema({
    local :{
        email: {
            type:String,
            es_indexed: true
        },
        password: String
    },
    bio: {
        type:String,
        es_indexed: true
    },
    image: Object,
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChatThread'
        }
    ],
    showEmail: Boolean,
    firstName: {
        type:String,
        es_indexed: true
    },
    lastName: {
        type:String,
        es_indexed: true
    },
    location: {
        city: {
            type:String,
            es_indexed: true
        },
        state: {
            type:String,
            es_indexed: true
        },
        zipcode: {
            type:String,
            es_indexed: true
        },
    },
    phone: {
        type:String,
        es_indexed: true
    },
    roles: {
        type: Array,           // Possible values: 'contractor', 'hirer', 'admin'
        es_indexed: true
    },
    skills: {
        type:Array,
        es_indexed: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],        // Array of ids from the Postings collection
    // Meta data
    _lastUpdated: Date,
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

// Set up the auto indexing
userSchema.plugin(mongoosastic, {
    esClient
});

exports.User = mongoose.model('User', userSchema);
