var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    name: String;,
    phone: String;
    address: Object;
    email: String;
    _addedOn: Date;
    _lastUpdate: Date;
}, { strict: false });

exports.Company = mongoose.model('Company', companySchema);
