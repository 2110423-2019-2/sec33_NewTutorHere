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

		//TODO: This search uses RegEx, consider changing it to something else later.
		// ** Not completed due to time constraints
		// Look into col.find() and how to use its find operators
		const result = await db.collection('CourseData').find({
			'subject': new RegExp(req.query.subject)
		}).limit(10).toArray();

		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log(req.body.subject, result)
		res.render('home', result);
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

module.exports = router;
