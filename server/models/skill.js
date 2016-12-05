const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
	title: String,
	description: String,
	topics: Array,
	_created: Date,
}, {
	strict: false
});

exports.Skill = mongoose.model('Skill', skillSchema);
