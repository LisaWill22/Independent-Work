'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');
const mongoose = require('mongoose');
const User = require('../models/user').User;
const Post = require('../models/post').Post;
const fs = require('fs');
const grid = require('gridfs');
const formidable = require('formidable');

router.route('/users/:id')
	.put(function(req, res, next) {
		delete req.body._id;
		delete req.body.__v;
		User.findOneAndUpdate({
			_id: req.params.id
		}, {
			$set: req.body
		}, {
			upsert: true,
			new: true
		}, function(err, user) {
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
		Post.findOneAndUpdate({
			_id: req.params.id
		}, {
			$set: req.body
		}, {
			upsert: true,
			new: true
		}, function(err, post) {
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

router.route('/user/profile-image')
	.post(function(req, res, next) {
		var form = new formidable.IncomingForm();
		    form.uploadDir = __dirname + "/uploads";
		    form.keepExtensions = true;

			form.parse(req, function (err, fields, files) {
		        if (!err) {
		            console.log('Files Uploaded: ' + files.file)
					console.log(files.file);
		            grid.mongo = mongoose.mongo;
		            var gfs = grid(db.db);
		            var writestream = gfs.createWriteStream({
		                filename: files.file.name
		            });
		            fs.createReadStream(files.file.path).pipe(writestream);
		        }
		    });

		    form.on('end', function () {
		        res.send('Completed ... go check fs.files & fs.chunks in mongodb');
		    });
	})

router.route('/users/:id/posts')
	.get(function(req, res, next) {
		Post.find({
			'user._id': req.params.id
		}, function(err, posts) {
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
