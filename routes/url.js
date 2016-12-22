var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;

var dbUrl = "mongodb://127.0.0.1:27017/test";

router.get('/', function (req, res, next) {

  var originalUrl = req.originalUrl.substring(1, req.originalUrl.length);
  mongoClient.connect(dbUrl, function (err, db) {

    assert.equal(null, err);
    console.log('Connected correctly to server...');
    var urlData = db.collection('urlData');

    urlData.count(function (err, num) {
      console.log(num);

      urlData.insertOne({
        id: num + 1001,
        shortCode: (num + 1001).toString(16),
        targetUrl: originalUrl
      }, function (err, result) {
        if (err)
          return console.error(err);
        console.log('Inserted!');
        res.json({
          originalUrl : originalUrl,
          shortUrl : "http://localhost:3000/" + (num+1001).toString(16)
        });
        db.close();
      }); // insertOne

    }); // count
  }); // connect

}); // router

module.exports = router;
