var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { check, validationResult } = require('express-validator');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myproject'
const client = new MongoClient(url);

// index page
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/resolve', [
  check("username", "Enter username").not().isEmpty(),
  check("password", "Enter password").not().isEmpty()
], function (req, res) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    // username/password empty
    res.send(errors[0]['msg']);
    // send  error.msg if error 
  } else {
    client.connect(function (err) {
      assert.equal(null, err);
      const db = client.db(dbName);
      // dbNmae = documents 
      db.collection('documents').find({
        'username' : req.body.username,
        'password' : req.body.password
      }).toArray(function(err,docs){
        assert.equal(err,null);
        console.log(docs);
        // print log if found
        if(docs.length ==0) res.send("Wrong username or Password");
        else res.render('home');
      })
    });
  }
});

module.exports = router;
