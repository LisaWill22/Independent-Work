// passport.js config

// load up the auth strategies we want to use
var LocalStrategy = require('passport-local').Strategy;

var chalk = require('chalk');

// load up the user model
var User = require('../models/user').User;

// export this function to our app using module.exports
module.exports = function(passport) {

	// Passport session setup
	//// Required for persistent login sessions
	//// Passport needs ability to serialize and unserialize users out of session.

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user for the session
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		})
	});

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) {
			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function() {
				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				User.findOne({
					'local.email': email
				}, function(err, user) {
					// if there are any errors, return the error
					if (err) {
						console.log(chalk.bgRed(err));
						return done(err);
					}

					// check to see if theres already a user with that email
					if (user) {
						console.log(chalk.red('Account already exists for >>', email));
						return done(null, false, {
							message: 'User with ' + email + ' already exists.'
						});
					} else {
						console.log('hello');
						// if there is no user with that email
						// create the user
						var newUser = new User();
						var roles = [];

						if (req.body.contractor) {
							roles.push('Contractor')
						}

						if (req.body.employer) {
							roles.push('Employer');
						}

						// set the user's local credentials
						newUser.firstName = req.body.firstName || '';
						newUser.lastName = req.body.lastName || '';
						newUser.local.email = email.toLowerCase();
						newUser.local.password = newUser.generateHash(password);
						newUser._accountCreated = new Date().toISOString();
						newUser.roles = req.body.roles || [];
						newUser.showEmail = true;

						// save the user
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser, {
								message: 'User successfully created with email: ' + email
							});
						});
					}
				});
			});
		}));

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) { // callback with email and password from our form
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({
				'local.email': email.toLowerCase()
			}, function(err, user) {
				// if there are any errors, return the error before anything else
				if (err) {
					console.log(err);
					return done(err);
				}

				// if no user is found, return the message
				if (!user) {
					console.log(chalk.yellow('No user found for ', email));
					return done(null, false, {
						message: 'No user found'
					});

				}

				// if the user is found but the password is wrong
				if (!user.validPassword(password)) {
                    console.log('found user, bad pass');
                    return done(null, false, {
    					message: 'Oops wrong password'
    				});
                }

				// all is well, return successful user
				return done(null, user);
			});

		}));
}
