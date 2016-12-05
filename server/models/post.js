const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: String,
    skills: Array,          // Array of id's from the Skills collection
    description: String,        // String ID from the Companies collection
    // Meta
    _createdDate: Date,
    lastPost: Object,
    replies: Array,
    topics: Array,
    user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    skills: Array
}, { strict: false });

exports.Post = mongoose.model('Post', postSchema);
