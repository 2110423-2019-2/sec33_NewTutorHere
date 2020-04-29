var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { check, validationResult } = require('express-validator');
var noti = require('./notificationManager.js');
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

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
			if(!validate){
				res.render('index', {wrong: "Wrong username or passwrod"});
			}
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
					res.redirect('/home_admin');
				}
				else{
					res.redirect('/home');
				}
			}
			else {
				res.render('index', {wrong: "Wrong username or passwrod"});
			}
		});
	}
});

router.post('/register', [
	check("usernameR", "Username should not be empty, minimum eight characters, maximum sixteen characters and no special character.").not().isEmpty(),
	check('usernameR', "Username should not be empty, minimum eight characters, maximum sixteen characters and no special character.").isLength({ min: 5, max: 16 }),
	check("usernameR", "Username should not be empty, minimum eight characters, maximum sixteen characters and no special character.").matches(/^(?=.*[0-9A-Za-z])[0-9a-zA-Z]{5,16}$/, "i"),
	check("passwordR", "Password should not be empty, minimum eight characters and maximum sixteen characters.").not().isEmpty(),
	check('passwordR', "Password should not be empty, minimum eight characters and maximum sixteen characters.").isLength({ min: 5, max: 16 }),
	check("passwordR", "Password should not be empty, minimum eight characters and maximum sixteen characters.").matches(/^(?=.*[0-9A-Za-z@$.!%*#?&])[0-9a-zA-Z@$.!%*#?&]{5,16}$/, "i"),
	check('firstname',"Firstname length should be between 1-20 characters.").isLength({ min: 1 ,max:20}),
	check('lastname',"Lastname length should be between 1-20 characters.").isLength({ min: 1 ,max:20}),
	check('phone',"Phone-number length should be between 9-19 and must contain only number.").isLength({ min: 9 ,max:19}),
	check('phone',"Phone-number length should be between 9-19 and must contain only number.").isNumeric(),
	check('emailR',"Email is invalid.").isEmail()
], function (req, res) {


	const result = validationResult(req);
	console.log(result);
	var errors = result.errors;
	console.log(req.body.passwordR);
	console.log(req.body);

	//var custom = require('./custom.js')
// 	var testspecial = /^[a-zA-Z0-9\\.;,:' ]{1,100}$/g( req.body.usernameR );  
 
//   if( testspecial )
//   {
//     res.render('index',{wrong:"Username must not contain any special character"}); 
//   }
	
	if (!result.isEmpty()) {
		// username/password empty
		//res.send(errors[0]['msg']);
		console.log("error is = " + errors[0]['msg']);
		res.render('index', {wrong: errors[0].msg});
		// send  error.msg if error 
	}
	else if(req.body.passwordR !== req.body.confirmedpassword){
		console.log("why u here!!!");
		res.render('index',{wrong:"password and re-password must be the same"});
	}
	else{
	//TODO: Check if the password and confirmed password match
	//TODO: Check inputs in general (blank, invalid, etc.) It should also be able to configure from the frontend side.
	passwordz = saltHashPassword(req.body.passwordR);
	console.log("passwordz complete");
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
			password: passwordz.passwordHash,
			salt : passwordz.salt,
			location: req.body.location,
			phone: req.body.phone,
			email: req.body.email,
			gender: req.body.gender,
			is_premium : 'no'
		});
		db.collection('AvailabilityController').insertOne({
			username:req.body.username,
			sunMor 		: 'no',
			sunAf   	: 'no',
			sunAfSc 	: 'no',
			sunEv 		: 'no',
			monMor		: 'no',
			monAf		: 'no',
			monAfSc		: 'no',
			monEv		: 'no',
			tueMor		: 'no',
			tueAf		: 'no',
			tueAfSc		: 'no',
			tueEv		: 'no',
			wedMor		: 'no',
			wedAf		: 'no',
			wedAfSc		: 'no',
			wedEv		: 'no',
			thuMor		: 'no',
			thuAf		: 'no',
			thuAfSc		: 'no',
			thuEv		: 'no',
			friMor		: 'no',
			friAf		: 'no',
			friAfSc		: 'no',
			friEv		: 'no',
			satMor		: 'no',
			satAf		: 'no',
			satAfSc		: 'no',
			satEv		: 'no'
		});
		console.log("U almost success!");
		res.cookie('auth', req.body.username);  // <-- This can be used to authenticate user later if needed (e.g. profile edit page)
		res.cookie('firstn', req.body.firstname);
		res.cookie('role', req.body.position);
		res.redirect('/home');
	});

	}
});


module.exports = router;
