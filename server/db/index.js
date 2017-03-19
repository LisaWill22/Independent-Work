const mongoose = require('mongoose');
const chalk = require('chalk');
const Grid = require('gridfs-stream');

module.exports = function(app) {
    mongoose.Promise = global.Promise;
    //TODO SWITCH ME
    mongoose.connect(process.env.MONGODB_URI);
    // mongoose.connect("mongodb://heroku_5jjz4t9j:7tuc3e5kka6pak2vab2euush4n@ds053166.mlab.com:53166/heroku_5jjz4t9j");

    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, chalk.red('connection error:')));

    connection.once('open', function(callback) {
      //TODO eSWITCH
    	// console.log(chalk.magenta('db connected to', process.env.MONGODB_URI));
    	Grid.mongo = mongoose.mongo;
    	const gfs = Grid(connection.db);
    	app.set('gridfs', gfs);
    });
};
