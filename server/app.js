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
const chatRoutes = require('./routes/chat');
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

// Event that handles when a user in the client connects,
io.sockets.on('connection', function(socket) {
	console.log('a user connected');

	io.sockets.emit('test', { message: 'This a test' });

	// Event that fires when a user in the client disconnectsion
	socket.on('disconnect', function(){
  		console.log('user disconnected');
	});

	// Event that fires when a user hits POST /api/messages
	socket.on('chat message', function(msg){
  		io.emit('chat message', msg);
	});
});

// Bring in routes
app.use(routes);
app.use('/api', apiRoutes);
app.use('/api', userRoutes);
// app.use('/chats', chatRoutes);


const Chat = require('./models/chat').Chat;

app.post('/chats', function(req, res, next) {

	// Create new chat model
	const newChat = new Chat(req.body);

	// Save the chat to mongo
	newChat.save(function(err, chat) {
		if (err) {
			console.log(err);
			return res.send(err);
		}

		// Emit the message to all users
		io.sockets.emit('chat message', chat);


		// Return the chat
		return res.send(chat);
	});
});
//

// Set up the static directory from which we are serving files
app.use(express.static(path.join(__dirname, '../client')));

// Set up some basic server stuff - error handler and listener handler
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// Error handler that fires on server.error event
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ?
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
	var addr = server.address();
	var bind = typeof addr === 'string' ?
		'pipe ' + addr :
		'port ' + addr.port;
	debug('Listening on ' + bind);
}

module.exports = app;
