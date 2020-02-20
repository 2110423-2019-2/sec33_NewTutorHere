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
	//var custom = require('./custom.js')
	
	if (!result.isEmpty()) {
		// username/password empty
		res.send(errors[0]['msg']);
		// send  error.msg if error 
		//custom.signIn();
	} else {
		client.connect(async function (err) {
			assert.equal(null, err);
			const db = client.db(dbName);
			const user = await db.collection('UserData').findOne({
				'username': req.body.username,
				'password': req.body.password
			});
			if (user) {
				// console.log(user)

				//TODO: Change from storing just the username as a login token to jwt
				res.cookie('auth', user.username);  // <-- This can be used to authenticate user later if needed (e.g. profile edit page)
				res.cookie('firstn', user.firstname);
				res.render('home', {name:req.cookies.auth});
			}
			else {
				res.send("Wrong username or Password");
			}
		});
	}
});

router.post('/register', [], function (req, res) {

	//TODO: Check if the password and confirmed password match
	//TODO: Check inputs in general (blank, invalid, etc.) It should also be able to configure from the frontend side.

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
