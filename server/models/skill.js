var mongoose = require('mongoose');

var skillSchema = new mongoose.Schema({
    name: String,
    description: String,
    categories: Array,
    _created: Date,
}, { strict: false });

exports.Skill = mongoose.model('Skill', skillSchema);
