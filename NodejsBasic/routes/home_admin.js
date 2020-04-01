var express = require('express');
var router = express.Router();
//connect to allFunction.js

const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const dbName = 'SEproject'

// home page
router.get('/', function (req, res, next) {
    var query
    res.cookie('role', 'admin');
    if (Object.keys(req.query).length !== 0) {
        if (req.query.position == "") {
            query = {
                'username': new RegExp(req.query.username),
            }
        } else {
            query = {
                'username': new RegExp(req.query.username),
                'position': req.query.position
            }
        }
        client.connect(async function (err) {
            assert.equal(null, err);
            const db = client.db(dbName);
            const result = await db.collection('UserData').find(query).toArray();
            res.render('home_admin', { searchResults: result });
        });
    }
    else {
        client.connect(async function (err) {
            assert.equal(null, err);
            const db = client.db(dbName);
            const result = await db.collection('UserData').find().toArray();
            res.render('home_admin', { searchResults: result });
        });

    }
});

router.get('/profile_admin/:username', function (req, res, next){
    res.send(req.params.username + "'s profile_admin")
});

module.exports = router;