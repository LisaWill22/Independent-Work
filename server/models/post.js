var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: String,
    skills: Array,          // Array of id's from the Skills collection
    description: String,        // String ID from the Companies collection
    // Meta
    _createdDate: Date,
    lastPost: Object,
    replies: Array,
    topics: Array
}, { strict: false });

exports.Posting = mongoose.model('Post', postingSchema);
