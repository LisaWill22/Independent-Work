var moment = require('moment');
var _ = require('lodash');
var express = require('express');
var router = express.Router();

module.exports = function(app, passport) {

    router.route('/login')
        .post(passport.authenticate('local-login', {}), function(req, res, next) {
            res.json(req.user);
        });

    router.route('/signup')
        .post(passport.authenticate('local-signup', {}), function(req, res, next) {
            if (req.user) {
              res.json(req.user);
            } else {
              res.send({ message: 'Sorry, that email already has an account registed with Parabola'})
            }
        });

    router.route('/logout')
        .get(function(req, res, next) {
            req.logout();
            res.redirect('/');
        });

    app.use('/auth', router);
};
