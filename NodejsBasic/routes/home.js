var express = require('express');
var router = express.Router();

const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
	//const collection = client.db("SEproject").collection("usernamePassword");
	// perform actions on the collection object
	console.log("Successfully connected to online database");
	client.close();
});

const dbName = 'SEproject'

// home page
router.get('/', function (req, res, next) {
	console.log("Loaded home.js")

	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			'subject' : new RegExp(req.query.subject),
			'level' : new RegExp(req.query.level),
			'city' : new RegExp(req.query.city),
			'rating' : new RegExp(req.query.rating),
			'price' : new RegExp(req.query.price),
			'tutor_id' : new RegExp(req.query.tutor_id)
		};
		//TODO: This search uses RegEx, consider changing it to something else later.
		// ** Not completed due to time constraints
		// Look into col.find() and how to use its find operators
		const result = await db.collection('CourseData').find(query).limit(10).toArray();

		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log(req.body.subject, result)
		res.render('home', { searchResults: result });
	});

	//TODO: Handle db connection failed error
});

// tutor's contract page
router.get('/tutors_contract', function (req, res, next) {
	res.render('tutors_contract');
});

// student's contract page
router.get('/students_contract', function (req, res, next) {
	res.render('students_contract');
});

// profile page
router.get('/profile', function (req, res, next) {
	res.render('profile');
});

module.exports = router;
