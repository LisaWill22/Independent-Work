const mongoose = require('mongoose');
const chalk = require('chalk');
const Grid = require('gridfs-stream');

module.exports = function(app) {
    mongoose.Promise = global.Promise;
    mongoose.connect(process.env.MONGODB_URI);

    const connection = mongoose.connection;

    connection.on('error', console.error.bind(console, chalk.red('connection error:')));

    connection.once('open', function(callback) {
    	console.log(chalk.magenta('db connected to', process.env.MONGODB_URI));
    	Grid.mongo = mongoose.mongo;
    	const gfs = Grid(connection.db);
    	app.set('gridfs', gfs);
    });
};
