var qs = require('querystring');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoskin = require('mongoskin');

var db = mongoskin.db(process.env.MONGODB_URI, {safe: true});
/*
 |--------------------------------------------------------------------------
 | Generic collections - CRUD for any collection in our MongoDB
 |--------------------------------------------------------------------------
*/

// Setup the collectionName param for requests
router.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

// API endpoints
// Thanks to http://webapplog.com/tutorial-node-js-and-mongodb-json-rest-api-server-with-mongoskin-and-express-js/

// GET /collections/:collectionName
router.route('/:collectionName')
  .get(function(req, res, next) {
    req.collection.find({},{limit:100, sort: [['_id',-1]]}).toArray(function(e, results){
      if (e) return next(e)
      res.send(results)
    })
  })
  .post(function(req, res, next) {
    req.collection.insert(req.body, {}, function(e, results){
      if (e) return next(e)
      res.send(results[0])
    })
  });

router.route('/:collectionName/:id')
  .get(function(req, res, next) {
    req.collection.findById(req.params.id, function(e, result){
      if (e) return next(e)
      res.send(result)
    })
  })
  .put(function(req, res) {
    delete req.body._id
    req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
      res.sendStatus((result===1)? 200 : 404 )
    });
  })
  .delete(function(req, res, next) {
    req.collection.removeById(req.params.id, function(e, result){
      if (e) return next(e)
      res.send((result===1)?{msg:'success'}:{msg:'error'})
    });
  });

module.exports = router;
