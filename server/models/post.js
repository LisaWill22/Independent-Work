const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: String,
    skills: Array,              // Array of id's from the Skills collection
    description: String,        // String ID from the Companies collection
    replies: Array,
    lastPost: Object,
    content: String,
    // Meta
    _createdDate: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    skills: Array
});

exports.Post = mongoose.model('Post', postSchema);
