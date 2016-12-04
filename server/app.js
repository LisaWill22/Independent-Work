'use strict';

// Grab our configs
require('dotenv').config();

// setup monitoring
require('newrelic');

// Bring in deps
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const redis = require('redis');
const chalk = require('chalk');
const redisSocket = require('socket.io-redis');

// Set up the deps
const client  = redis.createClient(process.env.REDIS_URL);
const debug = require('debug')('independent-work-front:server');
const Chat = require('./models/chat').Chat;
const RedisStore = require('connect-redis')(session);

// Bring in the passport configs (for auth)
require('./config/passport')(passport);

// Create the app
const app = express();
// DB bring in db connection
require('./db')(app);

// Get the port and set it
const port = process.env.PORT || 3000;
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set up basic express app stuffs
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
	extended: false,
    limit: '50mb'
}));
app.use(cookieParser());

// Required for passport
app.use(session({
    secret: 'ssshhhhh',
    // Connect express to redis
    store: new RedisStore({
        url: process.env.REDIS_URL
    }),
    saveUninitialized: false,
    resave: false
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
io.adapter(redisSocket(process.env.REDIS_URL));

// set in the app so we can use anywhere
app.set('socketio', io);

const pub = redis.createClient(process.env.REDIS_URL);
const store = redis.createClient(process.env.REDIS_URL)

// Event that handles when a user in the client connects,
io.on('connection', function(socket) {

    const sub = redis.createClient(process.env.REDIS_URL);

    socket.join('general');

    let userId;

    // Fired on connection from client
    socket.on('subscribe', function(id) {
        userId = id;
        // join a room with their id
        socket.join(id);
        console.log(io.sockets.adapter.rooms);
    });

    // Listen for a new chat being created
    socket.on('new private chat', function(data) {
        console.log(data);
        // Send the message out to the receiver
        socket.broadcast.emit('get private chat', data);
    });

    // Event that fires when a user in the client disconnectsion
    socket.on('disconnect', function(){
        socket.leave(userId);
        socket.leave('general');
        // remove user from currently connected users
        // sub.unsubscribe('messages');
        // sub.quit();
        // pub.publish('chatting', 'user disconnected: ' + socket.id)
    });

    // add user to currently connected users
    // sub.subscribe('chatting');
    //
    // sub.on('message', function(channel, message) {
    //     console.log('message received on server from publish');
    //     console.log(message);
    // });
    //
    // socket.on('message', function(message) {
    //     if (message.type === 'chat') {
    //         pub.publish('chatting', message);
    //     } else if (message.type === 'setUsername') {
    //         pub.publish('chatting','A new user in connected: ' + message.user);
    //         store.sadd('onlineUsers', message.user);
    //     }
    // });
});


// Bringi all the routes
const routes = require('./routes');
const userRoutes = require('./routes/user')(io);
const apiRoutes = require('./routes/crudApi');
const mailRoutes = require('./routes/mail');

// Bring in routes
app.use(routes);
app.use('/api', apiRoutes);
app.use('/api', userRoutes);
app.use('/mail', mailRoutes);

// Set up the static directory from which we are serving files
app.use(express.static(path.join(__dirname, '../client')));

// Set up some basic server stuff - error handler and listener handler
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
