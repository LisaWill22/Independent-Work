var moment = require('moment');
var _ = require('lodash');
var express = require('express');
var router = express.Router();
var chalk = require('chalk');

module.exports = function(app, passport) {

	router.route('/login')
		.post(passport.authenticate('local-login', {
			session: true
		}), function(req, res, next) {
			console.log(chalk.bgGreen('User logged in >> ', req.user.local.email));
			res.json(req.user);
		});

	router.route('/signup')
		.post(passport.authenticate('local-signup', {}), function(req, res, next) {
			if (req.user) {
				console.log(chalk.green('New user created for >> ', req.user.local.email));
				res.json(req.user);
			} else {
				console.log(chalk.red('Account already exists for >>', req.user.local.email));
				res.send({
					message: 'Sorry, that email already has an account registed with this app'
				})
			}
		});

	router.route('/logout')
		.get(function(req, res, next) {
			req.logout();
			res.redirect('/');
		});

	router.route('/pass-reset')
		.post(function(req, res, next) {
			console.log(req);
		});

	app.use('/auth', router);
};
