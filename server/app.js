'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const debug = require('debug')('independent-work-front:server');

const Chat = require('./models/chat').Chat;
// const redis = require('socket.io-redis');

// Setups up the dot env Stuff
require('dotenv').config();

// Bring in the passport configs (for auth)
require('./config/passport')(passport);

// DB bring in db connection
const db = require('./db');

// Create the app
const app = express();

// Get the port and set it
const port = process.env.PORT || 3000;
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Bringi all the routes
const routes = require('./routes');
const userRoutes = require('./routes/user');
const apiRoutes = require('./routes/crudApi');

// Set up basic express app stuffs
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

// Required for passport
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Bring in auth routes
require('./routes/auth')(app, passport); // Load our routes and pass in our app and fully configured passport

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// create the server instance from our app
const server = http.createServer(app);

// setup our sockets - Socket.io - http://socket.io/get-started/chat/
const io = require('socket.io')(server);
// io.adapter(redis({ host: 'localhost', port: 6379 }));

// Event that handles when a user in the client connects,
io.on('connection', function(socket) {
	console.log('a user connected');

	// Event that fires when a user in the client disconnectsion
	socket.on('disconnect', function(){
  		console.log('user disconnected');
	});

	//Sending message to Specific user
	socket.on('new chat',function(data){
		// Create new chat model
		var newChat = new Chat(data.message);
		// Save it to mongo
		newChat.save(function(err, chat) {
			if (err) {
				return console.log(err);
			}

			// Create new message thread if necessary


			// Alert every one in that room
			return io.in('general').emit('chat created', chat);
		});
	});

	// Join after a user connects
	socket.on('join', function (user) {
		socket.join('general'); // We are using room of socket io
		io.in('general').emit('user joined', user);
	});
});

// Bring in routes
app.use(routes);
app.use('/api', apiRoutes);
app.use('/api', userRoutes);

// Set up the static directory from which we are serving files
app.use(express.static(path.join(__dirname, '../client')));

// Set up some basic server stuff - error handler and listener handler
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
// 	const err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
// 	app.use((err, req, res, next) => {
// 		res.status(err.status || 500);
// 		res.render('error', {
// 			message: err.message,
// 			error: err
// 		});
// 	});
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use((err, req, res, next) => {
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: err.message,
// 		error: {}
// 	});
// });

// Error handler that fires on server.error event
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = typeof port === 'string' ?
		'Pipe ' + port :
		'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

// Event listener fired on the server.listening event
function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ?
		'pipe ' + addr :
		'port ' + addr.port;
	debug('Listening on ' + bind);
}

module.exports = app;
