'use strict';

// Bring in the deps
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user').User;
const esClient = require('../config/es');

router.route('/search/contractors')
	.get(function(req, res, next) {
		if (req.query && req.query.query && req.query.query.length >= 1) {
			esClient.search({
				q: req.query.query
			}).then(function(body) {
				if (body.hits.total >= 1) {
					let userList = body.hits.hits.map(user => {
						return mongoose.Types.ObjectId(user._id);
					});
					User.find({
						'_id': {
							$in: userList
						}
					}, function(err, users) {
						if (err) {
							res.status(401);
							res.send({
								success: false,
								error: err,
								message: 'There was a problem finding your users...'
							});
						} else {
							res.status(200);
							res.send({
								query: req.query.query,
								success:true,
								total: users.length,
								users
							})
						}
					})
				} else {
					res.status(201);
					res.send(body);
				}

			}, function(err) {
				res.status(404);
				res.send(err);
			})
		} else {
			User.find({
				'roles': {
					$in: ['contractor']
				}
			}, function(err, users) {
				if (err) {
					res.status(401);
					res.send({
						success: false,
						error: err,
						message: 'There was a problem finding your users...'
					});
				} else {
					res.status(200);
					res.send({
						success:true,
						total: users.length,
						users
					})
				}
			})
		}
	});

module.exports = router;
