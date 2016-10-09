var mongoose = require('mongoose');
var config = require('../config/db');

mongoose.connect(config.MONGO_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log('db connected to', config.MONGO_URI);
})

exports.db = db;
