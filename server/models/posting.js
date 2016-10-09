var mongoose = require('mongoose');

var postingSchema = new mongoose.Schema({
    name: String,
    skills: Array,          // Array of id's from the Skills collection
    company: String,        // String ID from the Companies collection
    // Meta
    _createdDate: Date,
    _lastupdatedDate: Date
}, { strict: false });

exports.Posting = mongoose.model('Posting', postingSchema);
