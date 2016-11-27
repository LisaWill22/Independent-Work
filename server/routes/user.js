var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user').User;
var Post = require('../models/post').Post;

router.route('/users/:id')
	.put(function(req, res, next) {
		delete req.body._id;
		delete req.body.__v;
		User.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, { upsert: true, new: true }, function(err, user) {
			if (!err) {
				res.send({
                    user,
					message: 'User updated successfully',
                    _lastUpdatedDate: new Date()
				});
			} else {
				console.log(err);
                return next(err);
			}
		});
	});

router.route('/posts/:id')
	.put(function(req, res, next) {
		delete req.body._id;
		delete req.body.__v;
		Post.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, { upsert: true, new: true }, function(err, post) {
			if (!err) {
				res.send({
                    post,
					message: 'Post updated successfully',
                    _lastUpdatedDate: new Date()
				});
			} else {
				console.log(err);
                return next(err);
			}
		});
	});

router.route('/users/:id/posts')
	.get(function(req, res, next) {
		Post.find({ 'user._id': req.params.id  }, function(err, posts) {
			if (!err) {
				res.send({
					posts,
					total: posts.length
				})
			} else {
				console.log(err);
				return next(err);
			}
		});
	});

module.exports = router;
