var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;

var dbUrl = process.env.MONGOLAB_URI;

router.get('/', function (req, res, next) {

    var originalUrl = req.originalUrl.substring(1, req.originalUrl.length);
    if (originalUrl.search(/[0-9a-z]+/g) == 0) { // If param is Hexadecimal
        mongoClient.connect(dbUrl, function (err, db) {

            assert.equal(null, err);
            console.log('Connected correctly to server...');
            var urlData = db.collection('urlData');

            urlData.findOne({ "shortCode": originalUrl }, function (err, doc) {
                if (err) {
                    console.error(err);
                    return;
                } else {
                    if (doc == null) {
                        res.render('nopage', { message: "Cannot find any URL with that name." });
                        db.close();
                    }
                    else {
                        console.log('Match found of the short URL submitted...');
                        console.log('Redirecting...');
                        res.status(302);
                        res.redirect(doc.targetUrl);
                        db.close();
                    }
                }
            }); // findOne

        }); // connect
    } else { // If bad parameter.
        console.log('Bad URL...');
        res.render('nopage', { message: "Cannot find any URL with that name." });
    }
}); // router

module.exports = router;