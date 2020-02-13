var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const monk = require('monk')

// Connection URL
const url = 'localhost:27017/TESTDB';

const db = monk(url);


db.then(() => {
  console.log('Connected correctly to server klsdjfsldkfjldskfj')
})
// index page
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/resolve',[
  check("username", "Enter username").not().isEmpty(),
  check("password", "Enter password").not().isEmpty()
], function (req, res) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    // username/password empty
    
  } else {
    var collection =db.get('test');
    collection.insert([{a: 1}, {a: 2}, {a: 3}])
    .then((docs) => {
      // docs contains the documents inserted with added **_id** fields
      // Inserted 3 documents into the document collection
    }).catch((err) => {
      // An error happened while inserting
    }).then(() => db.close())
    // check username and password in db
    
    var credential = req.body.username + ' ' + req.body.password;
    res.send('Login attempted with credential:' + credential);
  }
});
  
module.exports = router;
