'use strict';

// Bring in the deps
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user').User;
const esClient = require('../config/es');

// ping es to see if its working
esClient.ping({
	requestTimeout: 30000,
}, function(error) {
	if (error) {
		console.error('elasticsearch cluster is down!');
	} else {
		console.log('All is well');
	}
});

router.route('/search/contractors')
	.get(function(req, res, next) {
		esClient.search({
			q: req.query.query
		}).then(function(body) {
			res.status(200);
			res.send(body);
		}, function(err) {
			res.status(404);
			res.send(err);
		})
	});

module.exports = router;
