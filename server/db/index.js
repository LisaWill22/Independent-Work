var mongoose = require('mongoose');
var chalk = require('chalk');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, chalk.red('connection error:')));

db.once('open', function (callback) {
  console.log(chalk.magenta('db connected to', process.env.MONGODB_URI));
})

exports.db = db;
