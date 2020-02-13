var express = require('express');
var router = express.Router();

// home page
router.get('/', function(req, res, next) {
  res.render('home');
});

// tutor's contract page
router.get('/tutors_contract', function(req, res, next) {
  res.render('tutors_contract');
});

// student's contract page
router.get('/students_contract', function(req, res, next) {
  res.render('students_contract');
});

module.exports = router;
