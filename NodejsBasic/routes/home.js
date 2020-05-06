var express = require('express');
var router = express.Router();
//connect to allFunction.js
var crypto = require('crypto');
const assert = require('assert');
var noti = require('./notificationManager.js');
const { check, validationResult } = require('express-validator');
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
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
// home page
router.get('/',
	async function (req, res, next) {
	console.log("Loaded home.js")
	await client.connect();
	const db = client.db(dbName);
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	// var errors = result.errors;
	// if (!result.isEmpty()) {
	// 	console.log("FUCKTHISLIFE");
	// 	res.cookie("HomeError", errors[0].msg , { httpOnly: true });
	// 	res.redirect('/home');
	// 	// send  error.msg if error 
	// }
	// else{
	else{
	if( !isNaN(req.query.minprice) || !req.query.minprice  ){
		
			console.log(req.query.minprice + " its a number		");
		
		
	var query = {
		'subject': new RegExp(req.query.subject),
		'educational_level': new RegExp(req.query.level),
		'city': new RegExp(req.query.city),
		'rating': new RegExp(req.query.rating),
		'price': new RegExp(req.query.minprice), //Change this to price range please
		'is_premium': 'no'
		//'tutor_id': new RegExp(req.query.tutor_id)
	};
	var premium = {
		'subject': new RegExp(req.query.subject),
		'educational_level': new RegExp(req.query.level),
		'city': new RegExp(req.query.city),
		'rating': new RegExp(req.query.rating),
		'price': new RegExp(req.query.minprice),
		'is_premium': 'yes'
	}
	//TODO: This search uses RegEx, consider changing it to something else later.
	// ** Not completed due to time constraints
	// Look into col.find() and how to use its find operators
	const result = await db.collection('CourseData').find(query).limit(10).toArray();
	const result_premium = await db.collection('CourseData').find(premium).limit(10).toArray();
	
	// The search added the results to the locals, access them in home.ejs and show the results there
	console.log(result_premium);


	// Find noti data and pass to the template
	var user = req.cookies.auth;
	const resultLength =  await noti.getNotificationLength(user);
	var notification_data = await noti.getNotificationForUser(user);
	
	
	res.render('home', { searchResults: result, searchPremium: result_premium, role: req.cookies.role, notification_data: notification_data,resultLength:resultLength });
	
	
 }
 else{
	 console.log( req.query.minprice+ "is not a number bro!!!");
	var query = {
		'subject': new RegExp(req.query.subject),
		'educational_level': new RegExp(req.query.level),
		'city': new RegExp(req.query.city),
		'rating': new RegExp(req.query.rating),
		'is_premium': 'no'
		//'tutor_id': new RegExp(req.query.tutor_id)
	};
	var premium = {
		'subject': new RegExp(req.query.subject),
		'educational_level': new RegExp(req.query.level),
		'city': new RegExp(req.query.city),
		'rating': new RegExp(req.query.rating),
		'is_premium': 'yes'
	}
	//TODO: This search uses RegEx, consider changing it to something else later.
	// ** Not completed due to time constraints
	// Look into col.find() and how to use its find operators
	const result = await db.collection('CourseData').find(query).limit(10).toArray();
	const result_premium = await db.collection('CourseData').find(premium).limit(10).toArray();
	
	// The search added the results to the locals, access them in home.ejs and show the results there
	console.log(result_premium);


	// Find noti data and pass to the template
	var user = req.cookies.auth;
	const resultLength =  await noti.getNotificationLength(user);
	var notification_data = await noti.getNotificationForUser(user);
	
	
	res.render('home', { searchResults: result, searchPremium: result_premium, role: req.cookies.role, notification_data: notification_data,resultLength:resultLength,context:"yes" });
	
 }
}});

// tutor's contract page
router.get('/tutors_contract', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	var use = req.cookies.auth;
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"tutor_username": use,
			"status": 'requested',
		};
		requested = await db.collection('ContractData').find(query).toArray();
		

		query = {
			"tutor_username": use,
			"status": 'accepted',
		};
		accepted = await db.collection('ContractData').find(query).toArray();
		
		const resultLength = await noti.getNotificationLength(user);
		var user = req.cookies.auth;
		var notification_data = await noti.getNotificationForUser(user);
		res.render('tutors_contract', { requested: requested, accepted: accepted, role: req.cookies.role ,notification_data:notification_data,resultLength:resultLength});

	});
}});

// student's contract page
router.get('/students_contract', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	var use = req.cookies.auth;
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"student_username": use,
			"status": 'requested',
		};
		requested = await db.collection('ContractData').find(query).toArray();
		console.log(requested);

		query = {
			"student_username": use,
			"status": 'accepted',
		};
		accepted = await db.collection('ContractData').find(query).toArray();
		console.log(accepted);

		var user = req.cookies.auth;
		const resultLength = await noti.getNotificationLength(user);
		var notification_data = await noti.getNotificationForUser(user);
	    
		res.render('students_contract', { requested: requested, accepted: accepted, role: req.cookies.role ,notification_data:notification_data,resultLength,resultLength});

	});

}});


var ObjectID = require('mongodb').ObjectID;

router.post('/terminate_student_contract/:id',[
	check('ratingcomment',"").isLength({ min: 1})
], function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("terminating " + req.params.id);
		const result = validationResult(req);
	var errors = result.errors;
	
	if (!result.isEmpty()) {
		console.log("FUCKTHISLIFE  dfsdkfjlsdkjflksdjlfkl sldfkjsdl kfjlsdk jflsdkj flks");
		res.cookie("error", errors[0].msg , { httpOnly: true });
		res.redirect('/home/profile');
		// send  error.msg if error 
	}
	else{
		var query = {
			"_id": ObjectID(req.params.id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "terminated"
			}
		});

		tutor = await db.collection('ContractData').find(query).toArray();
		accepted = await db.collection('ContractData').find(query).toArray();
		var query1 = {
			"username": accepted[0].tutor_username
		}
		var query2 = {
			"username": accepted[0].student_username
		}
		var day = ["sunMor", "monMor", "tueMor", "wedMor", "thuMor", "friMor", "satMor", "sunAf", "monAf", "tueAf", "wedAf", "thuAf", "friAf", "satAf", "sunAfSc", "monAfSc", "tueAfSc", "wedAfSc", "thuAfSc", "friAfSc", "satAfSc", "sunEv", "monEv", "tueEv", "wedEv", "thuEv", "friEv", "satEv"];
		var time = parseInt(accepted[0].class_time) * 7 + parseInt(accepted[0].class_day);
		const tmp = day[time];
		await db.collection('AvailabilityController').updateOne(query1, {
			$set: {
				[tmp]: "no"
			}
		});
		await db.collection('AvailabilityController').updateOne(query2, {
			$set: {
				[tmp]: "no"
			}
		});
		var commentator = req.cookies.auth;
		
		var commentatee = tutor[0].tutor_username;
		db.collection('CommentController').insertOne({
			'commentator': commentator,
			'commentatee': commentatee,
			'rating': req.body.ratingcomment,
			'comment': req.body.comment
		});
		// calculate averrage rating and update to all course
		var query3 = {
			'commentatee': commentatee
		}
		AllComment = await db.collection('CommentController').find(query3).toArray();
		console.log(AllComment);
		var AvgRating = 0;
		for(var i = 0;i<AllComment.length;i++){
			AvgRating += parseInt(AllComment[i].rating) ;
		}
		AvgRating /= AllComment.length;
		AvgRating = ~~AvgRating; 
		console.log(AvgRating);
		console.log(AllComment.toString());
		db.collection('CourseData').updateMany(
			{
				'tutor_username': commentatee
			},
			{
				$set: {
					'rating': AvgRating.toString()
				}
			}
		);

		noti.notify(accepted[0].student_username, 3);
		res.redirect('/home/students_contract');
	}
	})
}});
router.post('/terminate_tutor_contract/:id',[
	check('ratingcomment',"").isLength({ min: 1})
] ,function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("terminating " + req.params.id);
		var errors = result.errors;
	if (!result.isEmpty()) {
		console.log("FUCKTHISLIFE  dfsdkfjlsdkjflksdjlfkl sldfkjsdl kfjlsdk jflsdkj flks");
		res.cookie("error", errors[0].msg , { httpOnly: true });
		res.redirect('/home/profile');
		// send  error.msg if error 
	}
	else{
		var query = {
			"_id": ObjectID(req.params.id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "terminated"
			}
		});

		tutor = await db.collection('ContractData').find(query).toArray();
		accepted = await db.collection('ContractData').find(query).toArray();
		var query1 = {
			"username": accepted[0].tutor_username
		}
		var query2 = {
			"username": accepted[0].student_username
		}
		var day = ["sunMor", "monMor", "tueMor", "wedMor", "thuMor", "friMor", "satMor", "sunAf", "monAf", "tueAf", "wedAf", "thuAf", "friAf", "satAf", "sunAfSc", "monAfSc", "tueAfSc", "wedAfSc", "thuAfSc", "friAfSc", "satAfSc", "sunEv", "monEv", "tueEv", "wedEv", "thuEv", "friEv", "satEv"];
		var time = parseInt(accepted[0].class_time) * 7 + parseInt(accepted[0].class_day);
		const tmp = day[time];
		await db.collection('AvailabilityController').updateOne(query1, {
			$set: {
				[tmp]: "no"
			}
		});
		await db.collection('AvailabilityController').updateOne(query2, {
			$set: {
				[tmp]: "no"
			}
		});
		var commentator = req.cookies.auth;
		
		var commentatee = tutor[0].student_username;
		db.collection('CommentController').insertOne({
			'commentator': commentator,
			'commentatee': commentatee,
			'rating': req.body.ratingcomment,
			'comment': req.body.comment
		});
		res.redirect('/home/tutors_contract');}
	})
}});
router.get('/accept_contract', function (req, res, next) {
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("accepting ");
		console.log(req.cookies._id);
		var query = {
			"_id": ObjectID(req.cookies._id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "accepted"
			}
		});
		accepted = await db.collection('ContractData').find(query).toArray();
		var query1 = {
			"username": accepted[0].tutor_username
		}
		var query2 = {
			"username": accepted[0].student_username
		}
		var day = ["sunMor", "monMor", "tueMor", "wedMor", "thuMor", "friMor", "satMor", "sunAf", "monAf", "tueAf", "wedAf", "thuAf", "friAf", "satAf", "sunAfSc", "monAfSc", "tueAfSc", "wedAfSc", "thuAfSc", "friAfSc", "satAfSc", "sunEv", "monEv", "tueEv", "wedEv", "thuEv", "friEv", "satEv"];
		var time = parseInt(accepted[0].class_time) * 7 + parseInt(accepted[0].class_day);
		const tmp = day[time];
		await db.collection('AvailabilityController').updateOne(query1, {
			$set: {
				[tmp]: "yes"
			}
		});
		await db.collection('AvailabilityController').updateOne(query2, {
			$set: {
				[tmp]: "yes"
			}
		});
		noti.notify(accepted[0].student_username, 1);
		res.redirect('/home');
	})
}});
router.get('/reject_contract', function (req, res, next) {
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("rejecting");
		console.log(req.cookies._id);
		var query = {
			"_id": ObjectID(req.cookies._id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "rejected"
			}
		});
		rejected = await db.collection('ContractData').find(query).toArray();
		noti.notify(rejected[0].student_username, 2);
		res.redirect('/home');
	})
}});
router.post('/delete_course', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"tutor_username": req.cookies.auth,
			"subject": req.cookies.sub
		};

		await db.collection('CourseData').remove(query);

		res.redirect('/home/profile');
	})
}});
router.post('/delete_comment', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"_id": ObjectID(req.cookies.sub_comment)
		};
		tmp = await db.collection('CommentController').find(query).toArray();
		noti.notify(tmp[0].commentator, 4);
		await db.collection('CommentController').remove(query);

		res.redirect('/home/profile');
	})
}});

// schedule page
router.get('/schedule', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{


	var use = req.cookies.auth;
	if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		const weekday = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
		var results = [];
		for (i = 0; i < weekday.length; i++) {
			var query = {
				"class_day": weekday[i],
				"tutor_username": use,
				"status": 'accepted',
			};
			results.push(await db.collection('ContractData').find(query).toArray());
		}
		console.log(results);
		res.render('schedule', { schedule: results });

	});
}});

// profile page
router.get('/profile', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	console.log("profile!!");
	var use = req.cookies.auth;
	if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query_username = {
			"username": use
		};
		var query_tutor_username = {
			"tutor_username": use

		};
		var query_availability = {
			"username": use
		};
		var comment = {
			"commentatee": use,
		};

		const result_user = await db.collection('UserData').find(query_username).limit(1).toArray();

		const result_availability = await db.collection('AvailabilityController').find(query_availability).toArray();

		const result_course = await db.collection('CourseData').find(query_tutor_username).toArray();

		const result_comment = await db.collection('CommentController').find(comment).toArray();
		var user = req.cookies.auth;
		var notification_data = await noti.getNotificationForUser(user);
		const resultLength =  await noti.getNotificationLength(user);
		var context = req.cookies["error"];
		  res.clearCookie("error", { httpOnly: true });
		if(context){
			if (result_user[0]['position'] == 'tutor') {
				res.render('profile_tutor', {
					pf: result_user[0], searchCourse: result_course,
					searchAvailability: result_availability, comment: result_comment, role: req.cookies.role,notification_data:notification_data , resultLength:resultLength,context:context
				});
			}
			else {
				res.render('profile_student', {
					pf: result_user[0], searchCourse: result_course,
					searchAvailability: result_availability, comment: result_comment, role: req.cookies.role,notification_data:notification_data , resultLength:resultLength,context:context
				});
			}
		}
		// The search added the results to the locals, access them in home.ejs and show the results there
	    else if (result_user[0]['position'] == 'tutor') {
			res.render('profile_tutor', {
				pf: result_user[0], searchCourse: result_course,
				searchAvailability: result_availability, comment: result_comment, role: req.cookies.role,notification_data:notification_data , resultLength:resultLength
			});
		}
		else {
			res.render('profile_student', {
				pf: result_user[0], searchCourse: result_course,
				searchAvailability: result_availability, comment: result_comment, role: req.cookies.role,notification_data:notification_data , resultLength:resultLength
			});
		}
	});

}});
router.post('/profile/edit_availability/:id', [], function (req, res) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	//if(req.cookies.auth == req.body.username)
	console.log("IN AVAILABILITY EDIT");
	var test = req.body.av;
	var day = ["sunMor", "monMor", "tueMor", "wedMor", "thuMor", "friMor", "satMor",
		"sunAf", "monAf", "tueAf", "wedAf", "thuAf", "friAf",
		"satAf", "sunAfSc", "monAfSc", "tueAfSc", "wedAfSc", "thuAfSc", "friAfSc", "satAfSc", "sunEv",
		"monEv", "tueEv", "wedEv", "thuEv", "friEv", "satEv"];

	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);
		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);
		var username = {
			"username": req.params.id
		};
		console.log(test + " WtF is going on here");
		for (var i = 0; i < 28; i++) {
			if (test[i] == 1) {
				db.collection('AvailabilityController').update(
					username,
					{
						$set: {
							[day[i]]: "yes"
						}
					}
				);
			}
			else {
				db.collection('AvailabilityController').update(
					username,
					{
						$set: {
							[day[i]]: "no"
						}
					}
				);
			}
		}
		res.redirect('/home/profile');
	});

}});
//sendContract /profile/edit_availability 
router.post('/profile', [	
	check('subject',"").isLength({ min: 1}),
	check('time',"").isLength({ min: 1}),
	check('day',"").isLength({ min: 1}),
], function (req, res) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	var use = req.cookies.auth;
	if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	const result = validationResult(req);
	var errors = result.errors;
	if (!result.isEmpty()) {
		console.log("FUCKTHISLIFE  dfsdkfjlsdkjflksdjlfkl sldfkjsdl kfjlsdk jflsdkj flks");
		res.cookie("error", errors[0].msg , { httpOnly: true });
		res.redirect('/home/profile');
		// send  error.msg if error 
	}
	else{
	//if(req.cookies.auth == req.body.username)
	console.log("IN SendconTract!");


	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);
		var query_username = {
			"username": use
		};
		var query_tutor_username = {
			"tutor_username": use

		};
		var query_tutor_availability = {
			"tutor_username": use,
			"status": "accepted"
		};
		db.collection('ContractData').insertOne({
			tutor_username: req.cookies.nextpf,
			student_username: req.cookies.auth,
			course_name: req.body.subject,
			educational_level: req.body.level,
			class_day: req.body.day,
			class_time: req.body.time,
			status: "requested",
			message: req.body.bio

		});
		noti.notify(req.cookies.nextpf, 0);

		// The search added the results to the locals, access them in home.ejs and show the results there

		res.redirect('/home/profile');
	});
}
}});
// edit-profile-form
router.post('/profile/edit_profile', [	
check('firstname',"Firstname length is not between 1-20").isLength({ min: 1 ,max:20}),
check('lastname',"Lastname length is not between 1-20").isLength({ min: 1 ,max:20}),
check('phone',"Phone-number length is not between 9-19").isLength({ min: 9 ,max:19}),
check('phone',"Phone-number must contain only number").isNumeric(),
check('emailR',"Email is invalid").not().isEmail()]
, function (req, res) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	const result = validationResult(req);
	var errors = result.errors;
	if (!result.isEmpty()) {
		console.log("FUCKTHISLIFE  dfsdkfjlsdkjflksdjlfkl sldfkjsdl kfjlsdk jflsdkj flks");
		res.cookie("error", errors[0].msg , { httpOnly: true });
		res.redirect('/home/profile');
		// send  error.msg if error 
	}
	else {
	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);

		db.collection('UserData').update(
			{
				username: req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
					'firstname': req.body.firstname,
					'lastname': req.body.lastname,
					'phone': req.body.phone,
					'location': req.body.location,
					'email': req.body.email,
					'gender': req.body.gender,
					'bio': req.body.bio
				}
			}
		);
	
		//console.log("Cannot be here!!!!! ! ! ! ! ! ");
		res.clearCookie("firstn");
		res.cookie('firstn', req.body.firstname);
		const result = await db.collection('UserData').find({ username: req.cookies.auth }).limit(1).toArray();
		console.log(result);
		res.redirect('/home/profile');
	});
}

}});
router.post('/profile/add_course', [	
	check('subject',"Subject name can not be empty").isLength({ min: 1}),
	check('price',"price must be an integer").isNumeric(),
	],
	 function (req, res) {
		if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
			res.redirect('/');
		}
		else{
	var use = req.cookies.auth;
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	const result = validationResult(req);
	var errors = result.errors;
	if (!result.isEmpty()) {
		console.log("FUCKTHISLIFE  dfsdkfjlsdkjflksdjlfkl sldfkjsdl kfjlsdk jflsdkj flks");
		res.cookie("error", errors[0].msg , { httpOnly: true });
		res.redirect('/home/profile');
		// send  error.msg if error 
	}
	else{
	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);
		var query_username = {
			"username": use
		};
		var query_tutor_username = {
			"tutor_username": use

		};
		var query_tutor_availability = {
			"tutor_username": use,
			"status": "accepted"
		};
		const result_user = await db.collection('UserData').find({ username: req.cookies.auth }).limit(1).toArray();
		db.collection('CourseData').insertOne({
			'subject': req.body.subject,
			'educational_level': req.body.level,
			'city': req.body.city,
			'rating': '0',
			'price': req.body.price,
			'tutor_username': req.cookies.auth,
			'is_premium': result_user[0]['is_premium']

		});

		// The search added the results to the locals, access them in home.ejs and show the results there


		res.redirect('/home/profile');

	});
}
	 }});

router.get('/testfunction', function (req, res, next) {
	//use function like this
	testFunction.data.checkcookie(req, res);
});

// premium
router.get('/premium', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query_username = {
			"username": req.cookies.auth
		};

		const result_user = await db.collection('UserData').find(query_username).limit(1).toArray();
		var user = req.cookies.auth;
		var notification_data = await noti.getNotificationForUser(user);
		const resultLength = await noti.getNotificationLength(user);

		// The search added the results to the locals, access them in home.ejs and show the results there
		res.render('premium', { role: req.cookies.role, pf: result_user[0], notification_data: notification_data, resultLength: resultLength });
	});

}});
router.get('/allseen', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	client.connect(async function (err) {
		noti.toggleSeen(req.cookies.auth);
		// The search added the results to the locals, access them in home.ejs and show the results there
		res.redirect('/home')
	});

}});
router.post('/buy_premium', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	console.log("Haaaaaaaaaaaaaaaaaaaaaaaa");
	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);

		db.collection('UserData').update(
			{
				username: req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
					'is_premium': 'yes'
				}
			}
		);
		db.collection('CourseData').updateMany(
			{
				'tutor_username': req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
					'is_premium': 'yes'
				}
			}
		);
		res.redirect('/home/profile');
	});
}});
router.post('/cancel_premium', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	console.log("Haaaaaaaaaaaaaaaaaaaaaaaa");
	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);

		db.collection('UserData').update(
			{
				username: req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
					'is_premium': 'no'
				}
			}
		);
		db.collection('CourseData').updateMany(
			{
				'tutor_username': req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
					'is_premium': 'no'
				}
			}
		);
		res.redirect('/home/profile');
	});
}});

// profile_tutor
router.get('/profile_tutor', function (req, res, next) {
	res.render('profile_tutor');
});

// profile_student
router.get('/profile_student', function (req, res, next) {
	res.render('profile_student');
});

router.get('/view_contract/:id', function (req, res, next) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
	var use = req.params.id;
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query_username = {
			"username": use
		};
		var query_tutor_username = {
			"tutor_username": use

		};
		var query_tutor_availability = {
			"tutor_username": use,
			"status": "accepted"
		};
		const result_user = await db.collection('UserData').find(query_username).limit(1).toArray();
		const result_course = await db.collection('CourseData').find(query_tutor_username).toArray();
		const result_availability = await db.collection('ContractData').find(query_tutor_availability).toArray();
		var comment = {
			"commentatee": use,
		};
		res.cookie('nextpf', result_user[0]["username"]);
		const result_comment = await db.collection('CommentController').find(comment).toArray();
		var user = req.cookies.auth;
		var notification_data = await noti.getNotificationForUser(user);
		const resultLength = await noti.getNotificationLength(user);
		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log(result_availability);
		if (result_user[0]['position'] == 'tutor') {
			res.render('profile_tutor', {
				pf: result_user[0], searchCourse: result_course,
				searchAvailability: result_availability, comment: result_comment, role: req.cookies.role, notification_data: notification_data, resultLength: resultLength
			});
		}
		else {
			res.render('profile_student', {
				pf: result_user[0], searchCourse: result_course,
				searchAvailability: result_availability, comment: result_comment, role: req.cookies.role, notification_data: notification_data, resultLength: resultLength
			});
		}
	});
}});


router.post('/:username/edit_profile_pic', [], function (req, res) {
	if(sha512(req.cookies.auth,'check').passwordHash !== req.cookies.check){
		res.redirect('/');
	}
	else{
    client.connect(async function (err) {
        //checks for connection error
        assert.equal(null, err);

        //once connected, add a doc to collection 'UserData'
        const db = client.db(dbName);

        db.collection('UserData').update(
            {
                username: req.params.username
            },
            {
                $set: {
                    'profilepic': req.body.profilepic,
                }
            }
        );
        res.redirect('back');
    });
}});

module.exports = router;