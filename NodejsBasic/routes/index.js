var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { check, validationResult } = require('express-validator');

const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  //const collection = client.db("SEproject").collection("usernamePassword");
  // perform actions on the collection object
  console.log("Connection Pinggy success");
  client.close();
});

 const dbName = 'SEproject'

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
      db.collection('UsernameAndPassword').find({
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
