var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user').User;

router.route('/users/:id')
	.put(function(req, res, next) {
		delete req.body._id;
		delete req.body.__v;
		User.findOneAndUpdate({_id: req.params.id}, { $set: req.body}, { upsert: true, new: true }, function(err, user) {
			if (!err) {
				res.send({
                    user,
					message: 'User updated successfully',
                    _timeUpdated: new Date()
				});
			} else {
				console.log(err);
                return next(err);
			}
		});
	})

module.exports = router;
