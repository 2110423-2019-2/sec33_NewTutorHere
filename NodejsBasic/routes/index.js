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
	console.log("Successfully connected to online database");
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
		client.connect(async function (err) {
			assert.equal(null, err);
			const db = client.db(dbName);
			const user = await db.collection('UserData').findOne({
				'username': req.body.username,
				'password': req.body.password
			});
			if (user == null) res.send("Wrong username or Password");
			else {
				res.render('home');
			}

			// db.collection('UserData').find({
			// 	'username': req.body.username,
			// 	'password': req.body.password
			// }).toArray(function (err, docs) {
			// 	assert.equal(err, null);
			// 	console.log(docs);
			// 	// print log if found
			// 	if (docs.length == 0) res.send("Wrong username or Password");
			// 	else {
			// 		res.render('home');
			// 		// Create and send token
			// 		const jwt = require('njwt')
			// 		const claims = { iss: 'NewTutoerHere' }
			// 		const token = jwt.create(claims, req.body.username)
			// 		token.setExpiration(new Date().getTime() + 60 * 1000)
			// 		res.send(token.compact())
			// 	}
			// })
		});
	}
});




router.post('/register', [], function (req, res) {

	//TODO: Check if the password and confirmed password match
	//TODO: Check inputs in general

	client.connect(function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);

		db.collection('UserData').insertOne({
			position: req.body.position,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			password: req.body.password,
			phone: req.body.phone,
			email: req.body.email,
			gender: req.body.gender
		});
	});

	res.render('home');
});

module.exports = router;
