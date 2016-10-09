var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    name: String;    
}, { strict: false });

exports.Company = mongoose.model('Company', companySchema);
