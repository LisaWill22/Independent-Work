const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

// Setups up the dot env Stuff
require('dotenv').config();
// DB bring in db connection
const db = require('./db');
// Create the app
const app = express();

// Route stuff
const routes = require('./routes');
const userRoutes = require('./routes/user');
const apiRoutes = require('./routes/crudApi');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

// Bring in the passport configs
require('./config/passport')(passport);

// Set up the static directory from which we are serving files
app.use(express.static(path.join(__dirname, '../client')));

// Bring in routes
app.use(routes);
app.use('/api', apiRoutes);
app.use('/api', userRoutes);
// app.use('/api/auth', authRoutes);
require('./routes/auth')(app, passport); // Load our routes and pass in our app and fully configured passport

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

module.exports = app;
