'use strict';

// Bring in the deps
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user').User;


// Set up elastic search
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
	host: process.env.SEARCHBOX_SSL_URL,
	log: 'trace'
});

// ping es to see if its working
client.ping({
	requestTimeout: 30000,
}, function(error) {
	if (error) {
		console.error('elasticsearch cluster is down!');
	} else {
		console.log('All is well');
	}
});

const returnRouter = function() {

	router.route('/search/contractors')
		.get(function(req, res, next) {
			console.log(req.query);
		});
}

module.exports = returnRouter;
