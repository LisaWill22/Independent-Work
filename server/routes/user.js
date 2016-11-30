'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user').User;
const Post = require('../models/post').Post;
const fs = require('fs');
const Grid = require('gridfs-stream');
const GridFS = Grid(mongoose.connection.db, mongoose.mongo);
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
					success: true,
					message: 'Post updated successfully',
					_lastUpdatedDate: new Date()
				});
			} else {
				console.log(err);
				return next(err);
			}
		});
	});

router.route('/user/:id/profile-image')
	.get(function(req, res, next) {
		const userId = req.params.id;
		User.findOne({
			_id: userId
		}, function(err, user) {
			if (user) {
				if (user.image && user.image._id) {
					console.log(user.image._id);
					GridFS.files.find({
						_id: user.image._id
					}).toArray(function(err, files) {
						if (files.length === 0) {
							return res.status(400).send({
								fileId: user.image._id,
								message: 'File not found'
							});
						}

						res.status(200);

						var readstream = GridFS.createReadStream({
							filename: files[0].filename
						});

						readstream.on('data', function(data) {
							res.send({
								image: data.toString('base64')
							});
						});

						readstream.on('end', function() {
							res.end();
						});

						readstream.on('error', function(err) {
							console.log('An error occurred!', err);
							throw err;
						});
					});
				} else {
					console.log('user does not have an image');
					return res.json({
						success: false,
						message: 'User does not have profile image',
					})
				}
			} else {
				console.log(user);
				return console.log(err);
			}
		})

	})
	.post(function(req, res, next) {
		let form = new formidable.IncomingForm();
		const userId = req.params.id;
		form.uploadDir = __dirname + '/uploads';
		form.keepExtensions = true;
		form.parse(req, function(err, fields, files) {
			if (!err) {
				console.log('File Uploaded: ' + files.file.path)

				let writestream = GridFS.createWriteStream({
					filename: files.file.name
				});

				fs.createReadStream(files.file.path).pipe(writestream);

				writestream.on('close', function(file) {
					console.log(file.filename + ' Written To DB');
					console.log(file._id);

					User.findOneAndUpdate({
						_id: userId
					}, {
						$set: {
							'image._id': file._id
						}
					}, {
						upsert: true,
						new: true
					}, function(err, user) {
						if (!err) {
							return res.send({
								user,
								success: true,
								message: 'Profile image uploaded successfully',
								file: files.file.path
							});
						} else {
							console.log(err);
							return res.status(404).send({
								userId,
								success: false,
								message: 'Failed to assign upload to user',
								file: files.file.path
							});
						}
					});
				});
			}
		});
	});

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
