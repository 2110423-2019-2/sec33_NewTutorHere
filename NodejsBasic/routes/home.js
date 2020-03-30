var express = require('express');
var router = express.Router();
//connect to allFunction.js

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
			'subject': new RegExp(req.query.subject),
			'educational_level': new RegExp(req.query.level),
			'city': new RegExp(req.query.city),
			'rating': new RegExp(req.query.rating),
			'price': new RegExp(req.query.minprice), //Change this to price range please
			//'tutor_id': new RegExp(req.query.tutor_id)
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
		console.log(requested);

		query = {
			"tutor_username": use,
			"status": 'accepted',
		};
		accepted = await db.collection('ContractData').find(query).toArray();
		console.log(accepted);


		res.render('tutors_contract', { requested: requested, accepted: accepted });

	});
});

// student's contract page
router.get('/students_contract', function (req, res, next) {
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


		res.render('students_contract', { requested: requested, accepted: accepted });

	});

});


var ObjectID = require('mongodb').ObjectID;

router.get('/terminate_contract/:id', function (req, res, next) {
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("terminating " + req.params.id);
		var query = {
			"_id": ObjectID(req.params.id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "terminated"
			}
		});
		res.redirect('/home/tutors_contract');
	})
});
router.get('/accept_contract', function (req, res, next) {
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("accepting " );
		console.log(req.cookies._id);
		var query = {
			"_id": ObjectID(req.cookies._id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "accepted"
			}
		});
		res.redirect('/home');
	})
});
router.get('/reject_contract', function (req, res, next) {
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		console.log("rejecting" );
		console.log(req.cookies._id);
		var query = {
			"_id": ObjectID(req.cookies._id)
		};
		await db.collection('ContractData').updateOne(query, {
			$set: {
				"status": "rejected"
			}
		});
		res.redirect('/home');
	})
});
router.post('/delete_course', function (req, res, next) {
	
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"tutor_username" : req.cookies.auth,
			"subject": req.cookies.sub
		};
		
		await db.collection('CourseData').remove(query);
		
		res.redirect('/home/profile');
	})
});

// schedule page
router.get('/schedule', function (req, res, next) {
	// res.render('schedule');


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
});

// profile page
router.get('/profile', function (req, res, next) {
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
		var query_tutor_availability = {
			"tutor_username": use,
			"status": "accepted"
		};
		var comment = {
			"commentatee": use,
		};
		const result_user = await db.collection('UserData').find(query_username).limit(1).toArray();
		const result_course = await db.collection('CourseData').find(query_tutor_username).toArray();
		const result_availability = await db.collection('ContractData').find(query_tutor_availability).toArray();
		const result_comment = await db.collection('CommentController').find(comment).toArray();
		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log(result_availability);
		res.render('profile', { pf: result_user[0], searchCourse: result_course, searchAvailability: result_availability ,comment:result_comment});
	});

});

//sendContract
router.post('/profile', [], function (req, res) {
	var use = req.cookies.auth;
	if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
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

		// The search added the results to the locals, access them in home.ejs and show the results there

		const result_user = await db.collection('UserData').find({ username: req.cookies.nextpf }).limit(1).toArray();
		const result_course = await db.collection('CourseData').find(query_tutor_username).toArray();
		const result_availability = await db.collection('ContractData').find(query_tutor_availability).toArray();
		res.redirect('/home/profile');
	});
});
// edit-profile-form
router.post('/profile/edit_profile', [], function (req, res) {

	//if(req.cookies.auth == req.body.username)
	console.log("IN PROFILE EDIT");
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
					'email': req.body.email,
					'gender': req.body.gender,
					'bio': req.body.bio
				}
			}
		);
		res.cookie('firstn', req.body.firstname);
		const result = await db.collection('UserData').find({ username: req.cookies.auth }).limit(1).toArray();
		console.log(result);
		res.redirect('/home/profile');
	});

});
router.post('/profile/add_course', [], function (req, res) {
	var use = req.cookies.auth;
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }

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
		const result_user = await db.collection('UserData').find({ username: req.cookies.auth}).limit(1).toArray();
		db.collection('CourseData').insertOne({
			'subject': req.body.subject,
			'educational_level': req.body.level,
			'city': req.body.city,
			'rating': req.body.rating,
			'price': req.body.price,
			'tutor_username' : req.cookies.auth,
			'is_premium' : result_user[0]['is_premium']

		});

		// The search added the results to the locals, access them in home.ejs and show the results there

		
		res.redirect('/home/profile');

	});
});
router.post('/profile/add_comment', [], function (req, res) {
	var use = req.cookies.auth;
	//if (typeof req.cookies.nextpf != 'undefined') { use = req.cookies.nextpf; }
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
		db.collection('CommentController').insertOne({
			'commentator': use,
			'commentatee': req.cookies.nextpf,
			'comment': req.body.comment
		});
		console.log("Comment!!!");
		// The search added the results to the locals, access them in home.ejs and show the results there

		
		res.redirect('/home/profile');

	});
});
router.get('/testfunction', function (req, res, next) {
	//use function like this
	testFunction.data.checkcookie(req, res);
});

// premium
router.get('/premium', function (req, res, next) {
	res.render('premium');
});
router.post('/premium', function (req, res, next) {
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
});

// profile_tutor
router.get('/profile_tutor', function (req, res, next) {
	res.render('profile_tutor');
});

// profile_student
router.get('/profile_student', function (req, res, next) {
	res.render('profile_student');
});


/* admin part */
// admin home
router.get('/home_admin', function (req, res, next) {
	res.render('home_admin');
});
router.get('/view_contract/:id', function (req, res, next) {
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
		const result_comment = await db.collection('CommentController').find(comment).toArray();
        // The search added the results to the locals, access them in home.ejs and show the results there
        console.log(result_availability);
        res.render('profile', { pf: result_user[0], searchCourse: result_course, searchAvailability: result_availability,comment:result_comment});
    });
});

module.exports = router;