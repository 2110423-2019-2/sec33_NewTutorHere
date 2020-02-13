var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

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
    // check username and password in db
    var credential = req.body.username + ' ' + req.body.password;
    res.send('Login attempted with credential:' + credential);
  }
});
  
module.exports = router;
