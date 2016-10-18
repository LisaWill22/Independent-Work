var moment = require('moment');
var _ = require('lodash');
var express = require('express');
var router = express.Router();
var async = require('async');
var chalk = require('chalk');

module.exports = function(app, passport) {

    router.route('/login')
        .post(passport.authenticate('local-login', {}), function(req, res, next) {
            res.json(req.user);
        });

    router.route('/signup')
        .post(passport.authenticate('local-signup', {}), function(req, res, next) {
            if (req.user) {
              console.log(chalk.green('New user created for >> ', req.user.local.email));
              res.json(req.user);
            } else {
              console.log(chalk.red('Account already exists for >>', req.user.local.email));
              res.send({ message: 'Sorry, that email already has an account registed with this app'})
            }
        });

    router.route('/logout')
        .get(function(req, res, next) {
            req.logout();
            res.redirect('/');
        });

    router.route('/forgot')
        .post(function(res, res, next) {
            async.waterfall([
                function(done) {
                  crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                  });
                },
                function(token, done) {
                  User.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        console.error('No account w/ that email address exists');
                      req.flash('error', 'No account with that email address exists.');
                      return res.redirect('/forgot');
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                      done(err, token, user);
                    });
                  });
                },
                function(token, user, done) {
                  var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'SendGrid',
                    auth: {
                      user: process.env.EMAIL_USER,
                      pass: process.env.EMAIL_PASS
                    }
                  });
                  var mailOptions = {
                    to: user.email,
                    from: 'passwordreset@iw-app.com',
                    subject: 'Reset your password',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                  };
                  smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                  });
                }
              ], function(err) {
                if (err) return next(err);
                res.redirect('/forgot');
              });
        });

    app.use('/auth', router);
};
