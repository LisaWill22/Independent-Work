'use strict';

const moment = require('moment');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const User = require('../models/user').User;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

// Load in configs from your .env file
require('dotenv').config();

// Bring in nodemailer
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
// Bring in the mail to send an email notifcation
const mailer = require('../services/mailer');

// SMPT transporter
const smtpString = `smtps://${process.env.GMAIL_USER}%40gmail.com:${process.env.GMAIL_PASS}@smtp.gmail.com`;
const transporterSMTP = nodemailer.createTransport(smtpString);

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
				mailer.signupNotification(req.user);
				res.json(req.user);
			} else {
				console.log(chalk.red('Account already exists for >>', req.user.local.email));
				res.status(401);
				res.send({
					message: 'Sorry, that email already has an account registed with this app'
				});
			}
		});

	router.route('/logout')
		.get(function(req, res, next) {
			req.logout();
			res.redirect('/');
		});

	router.route('/change-password')
	 	.post(function(req, res, next) {
			const oldPassword = req.body.oldPassword;
			const newPassword = req.body.newPassword;
			User.findOne({
				'local.email': req.body.local.email
			}, function(err, user) {
				if (!user) {
					console.log(err);
				} else {
					if (user.validPassword(oldPassword)) {
						user.local.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);
						user.save(function(err, user) {
							if (!user) {
								console.log(err);
							} else {
								return res.status(200).send({
									user,
									message: 'Password updated successfully for ' + user.local.email,
								});
							}
						});
					} else {
						res.status(401).send({
							message: 'Wrong password'
						});
					}
				}
			});
		});

	router.route('/pass-reset')
		.post(function(req, res, next) {
			User.findOne({
				_resetPasswordToken: req.body.resetToken,
				_resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (!user) {
					console.log('Token expired or no user found');
					return res.status(404).send({
						message: 'Token expired or no user w/ that token',
						token: req.body.resetToken,
						email: req.body.email
					})
				}

				user.local.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
				user._resetPasswordToken = null;
				user._resetPasswordExpires = null;

				user.save(function(err, user) {
					return res.status(200).send({
						message: 'Password updated successfully for ' + req.body.email,
						email: req.body.email
					});
				});
			});
		})

	router.route('/pass-forgot')
		.post(function(req, res, next) {
			console.log(req.body, "+++++++++++++++++++++++++++++++++");
			User.findOne({
				'local.email': req.body.email
			}, function(err, user) {
				if (user) {
					crypto.randomBytes(20, function(err, buf) {
						const token = buf.toString('hex');
						user._resetPasswordToken = token;
						user._resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err, user) {

							let mailOptions = {
								from: 'pass-reset@independent-work.com', // sender address
								to: user.local.email, // list of receivers
								subject: 'Password reset instructions from Independent Work', // Subject line
								text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
									'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
									'http://' + req.headers.host + '/#/reset-password?email=' + user.local.email + '&resetToken=' + token + '\n\n' +
									'If you did not request this, please ignore this email and your password will remain unchanged.\n'
							};

							mailOptions = Object.assign(mailOptions, req.body);

							// Send mail with defined transport object
							transporterSMTP.sendMail(mailOptions, function(error, info) {
								if (error) {
									console.log(error);
									// Send a sad little error back to the client
									return res.send(error.responseCode, {
										message: 'Could not send your email :(',
										error,
										mailOptions
									});
								}

								// Send a happy little response back to the client
								return res.send({
									status: 'Message sent: ' + info.response + ' :)',
									mailOptions,
									_sendDate: new Date()
								});
							});
						})
					});

				} else {
					return res.status(404).send({
						message: 'No user found with that email: ' + req.body.email,
						email: req.body.email
					});
				}
			});
		});

	app.use('/auth', router);
};
