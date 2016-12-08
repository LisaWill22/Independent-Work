'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user').User;
const Post = require('../models/post').Post;
const Chat = require('../models/chat').Chat;
const ChatThread = require('../models/chatThread').ChatThread;
const fs = require('fs');
const Grid = require('gridfs-stream');
const GridFS = Grid(mongoose.connection.db, mongoose.mongo);
const formidable = require('formidable');
const io = require('socket.io-emitter');

const returnRouter = function(io) {

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
                    post.populate('user', function(err, user) {
                        res.send({
        					post,
        					success: true,
        					message: 'Post updated successfully',
        					_lastUpdatedDate: new Date()
        				});
                    });
    			} else {
    				console.log(err);
    				return next(err);
    			}
    		});
    	});

    router.route('/users/:id/profile-image')
    	.get(function(req, res, next) {
    		const userId = req.params.id;
    		User.findOne({
    			_id: userId
    		}, function(err, user) {
    			if (user) {
    				if (user.image && user.image._id) {
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

    				let readStream = fs.createReadStream(files.file.path).pipe(writestream);

    				writestream.on('close', function(file) {

    					GridFS.files.find({
    						_id: file._id
    					}).toArray(function(err, files) {
    						if (files.length === 0) {
    							console.log('no files');
    							return res.status(400).send({
    								fileId: file._id,
    								message: 'File not found'
    							});
    						}

    						var readstream = GridFS.createReadStream({
    							filename: files[0].filename
    						});

    						readstream.on('data', function(data) {
    							User.findOneAndUpdate({
    								_id: userId
    							}, {
    								$set: {
    									'image.base64URL': data.toString('base64'),
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
    										file: file.fileName
    									});
    								} else {
    									console.log(err);
    									return res.status(404).send({
    										userId,
    										success: false,
    										message: 'Failed to assign upload to user',
    										file: file.fileName
    									});
    								}
    							});
    						});

    						readstream.on('error', function(err) {
    							console.log('An error occurred!', err);
    							throw err;
    						});
    					});
    				});
    			}
    		});
    	});

    router.route('/users/:id/chat/:friendId')
    	.post(function(req, res, next) {
    		// Create a new chat thread
    		const newChatThread = new ChatThread({
    			users: req.body.users,
    			chats: [],
    			_dateUpdated: new Date()
    		});
    		newChatThread.save(function(err, savedChatThread) {
    			if (err) {
    				res.status(404);
    				res.send({
    					success: false,
    					error: err
    				});
    				return console.log(err);
    			}

    			// addChatThreadToUser(req.params.id, newChatThread._id)
                //     .then(function(user) {
                //         console.log(user.chats);
                //     });
    			// addChatThreadToUser(req.params.friendId, newChatThread._id)
                //     .then(function(user) {
                //         console.log(user.chats);
                //     });

    			// Create the new individual chat message
                req.body.chat.chatThread = savedChatThread._id;
    			const newChat = new Chat(req.body.chat)
    			newChat.save(function(err, savedChat) {
    				if (err) {
    					res.status(404);
    					res.send({
    						success: false,
    						error: err
    					});
    					return console.log(err);
    				}

    				// Add back the saved chat to the chat thread
                    addChatToThread(savedChat, savedChatThread._id)
                        .then(function(chatThread){
                            chatThread.chats[0] = savedChat;
                            res.status(200);
                            res.send({
                                chatThread,
                                success: true,
                                message: 'New chat thread created successfully!'
                            })
                        })
                        .catch(function(err) {
                            res.status(404);
                            res.send({
                                message: 'Failed to add chat to thread...',
                                success: false,
                                error: err
                            });
                            return console.log(err);
                        });
    			});
    		});
    	})
    	.put(function(req, res, next) {
    		const newChat = new Chat(req.body.chat);
    		newChat.save(function(err, chat) {
    			if (err) {
    				res.status(400);
    				return res.send({
    					error: err,
    					success: false,
    					message: 'Failed to add chat to thread'
    				});
    			} else {
    				addChatToThread(chat, req.body.chatThread._id)
    					.then(function(chatThread) {
                            io.emit('new private chat', chat);
    						res.status(200);
    						return res.send({
    							chat,
    							success: true,
    							message: 'Chat added to thread successfully!'
    						});
    					})
    					.catch(function(err) {
    						console.log(err);
    						res.status(400);
    						return res.send({
    							error: err,
    							success: false,
    							message: 'Failed to add chat to thread'
    						});
    					});
    			}
    		});
    	})
    	.get(function(req, res, nex) {
    		ChatThread.findOne({
    				'users': {
    					$all: [req.params.id, req.params.friendId]
    				}
    			})
    			.populate('users')
    			.populate({
    				path: 'chats',
    				options: {
    					sort: {
    						'_dateSent': 'asc'
    					}
    				}
    			})
    			.exec(function(err, chatThread) {
    				if (err) {
    					console.log(err);
    					return res.send({
    						error: err,
    						success: false,
    						message: 'There was an error getting this chat chatread'
    					})
    				}
    				res.status(200);
    				if (!chatThread) {
    					return res.send({
    						chatThread,
    						success: true,
    						message: 'No chat was found!'
    					})
    				} else {
    					return res.send({
    						chatThread,
    						success: true,
    						message: 'Chat found successlly'
    					});
    				}
    			});

    	});

    router.route('/posts/dashboard/includes=skills,user')
        .get(function(req, res, next) {
            Post.find()
                .populate('user')
                .exec(function(err, posts) {
                    if (!err) {
                        res.send({
                            posts,
                            total: posts.length
                        })
                    } else {
                        console.log(err);
                        res.status(404);
                        return res.send({
                            success: true,
                            error: err
                        });
                    }
                });
        });

    router.route('/posts/:id/includes=skills,user')
        .get(function(req, res, next) {
            Post.findOne({ _id: req.params.id })
                .populate('skills')
                .populate('user')
                .exec(function(err, post) {
                    if (!err) {
        				res.send({
        					post,
        					success: true,
        				})
        			} else {
        				console.log(err);
                        res.status(404);
                        return res.send({
        					success: true,
                            error: err
        				});
        			}
                });
        });

    router.route('/users/:id/posts')
    	.get(function(req, res, next) {
            console.log(req.params);
    		Post.find({'user': req.params.id})
                .populate('user')
                .exec(function(err, posts) {
                    if (!err) {
        				res.send({
        					posts,
        					total: posts.length
        				})
        			} else {
                        console.log(err);
                        res.status(404);
                        return res.send({
        					success: true,
                            error: err
        				});
        			}
                });
    	});

    function addChatThreadToUser(chatThreadId, userId) {
        return User.findOneAndUpdate({
            		_id: userId
            	}, {
            		$push: {
                        'messageThreads': chatThreadId,
            			'chats': chatThreadId
            		}
            	}, {
            		upsert: true,
            		new: true
            	});
    }

    function addChatToThread(chat, chatThreadId) {
    	return ChatThread.findOneAndUpdate({
            		_id: chatThreadId
            	}, {
            		$push: {
            			'chats': chat._id
            		}
            	}, {
            		upsert: true,
            		new: true
            	});
    }

    return router;
}

module.exports = returnRouter;
