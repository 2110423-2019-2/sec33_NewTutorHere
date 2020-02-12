var express = require('express');
var router = express.Router();

// index page
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/resolve', function (req, res) {
  var credential = req.body.username + ' ' + req.body.password;
  res.send('Login attempted with credential:' + credential);
});

module.exports = router;
