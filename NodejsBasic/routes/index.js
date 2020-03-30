var express = require('express');
var router = express.Router();
var crypto = require('crypto');
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

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
	console.log('nSalt = '+passwordData.salt);
	return {
		salt:salt,
		passwordHash:passwordData.passwordHash
	};
}
router.post('/', [
	check("username", "Enter username").not().isEmpty(),
	check("password", "Enter password").not().isEmpty(),
	check('password').isLength({ min: 5 }),
	check('username').isLength({ min: 6 })
], function (req, res) {
	const result = validationResult(req);
	var errors = result.errors;

	//var custom = require('./custom.js')
	
	if (!result.isEmpty()) {
		// username/password empty
		//res.send(errors[0]['msg']);
		res.render('index', {wrong: errors[0].param +" is invalid"});
		// send  error.msg if error 
	} else {
		client.connect(async function (err) {
			assert.equal(null, err);
			const db = client.db(dbName);
			
			const validate = await db.collection('UserData').findOne({
				'username': req.body.username,
			});
			var passwordData = sha512(req.body.password, validate.salt);
			const user = await db.collection('UserData').findOne({
				'username': req.body.username,
				'password': passwordData.passwordHash
			});
			if (user) {
				// console.log(user)
				console.log('connect to user');
				//TODO: Change from storing just the username as a login token to jwt
				res.cookie('auth', user.username);  // <-- This can be used to authenticate user later if needed (e.g. profile edit page)
				res.cookie('firstn', user.firstname);
				res.cookie('role', user.position);
				if(user.position == 'admin') console.log(user.position);
				if(user.position == 'admin'){
					const UserData = await db.collection('UserData').find({}).toArray();
					console.log(UserData);
					res.render('home_admin', {all:UserData, role:req.cookies.role});
				}
				else{
					res.render('home', {name:req.cookies.auth, role:req.cookies.role});
				}
			}
			else {
				res.render('index', {wrong: "Wrong username or passwrod"});
			}
		});
	}
});

router.post('/register', [], function (req, res) {

	//TODO: Check if the password and confirmed password match
	//TODO: Check inputs in general (blank, invalid, etc.) It should also be able to configure from the frontend side.
	password = saltHashPassword(req.body.password);
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
			password: password.passwordHash,
			salt : password.salt,
			phone: req.body.phone,
			email: req.body.email,
			gender: req.body.gender,
			is_premium : 'no'
		});
		res.cookie('auth', req.body.username);  // <-- This can be used to authenticate user later if needed (e.g. profile edit page)
		res.cookie('firstn', req.body.firstname);
		res.cookie('role', req.body.position);
		res.render('home', {name:req.cookies.auth, role:req.cookies.role});
	});

	
});


module.exports = router;
