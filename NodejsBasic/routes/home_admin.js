var express = require('express');
var router = express.Router();
//connect to allFunction.js

const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const dbName = 'SEproject'

// home page
router.get('/', function (req, res, next) {
    var query
    res.cookie('role', 'admin');
    if (Object.keys(req.query).length !== 0) {
        if (req.query.position == "") {
            query = {
                'username': new RegExp(req.query.username),
            }
        } else {
            query = {
                'username': new RegExp(req.query.username),
                'position': req.query.position
            }
        }
        client.connect(async function (err) {
            assert.equal(null, err);
            const db = client.db(dbName);
            const result = await db.collection('UserData').find(query).toArray();
            res.render('home_admin', { searchResults: result });
        });
    }
    else {
        client.connect(async function (err) {
            assert.equal(null, err);
            const db = client.db(dbName);
            const result = await db.collection('UserData').find().toArray();
            res.render('home_admin', { searchResults: result });
        });

    }
});

router.get('/profile_admin/:username', function (req, res, next) {
    // res.send(req.params.username + "'s profile_admin")
    const username = req.params.username;
    client.connect(async function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        var query_username = {
            "username": username
        };
        var query_tutor_username = {
            "tutor_username": username

        };
        var query_tutor_availability = {
            "tutor_username": username,
            "status": "accepted"
        };
        var query_student_availability = {
            "student_username": username,
            "status": "accepted"
        };
        var comment = {
            "commentatee": username,
        };
        const result_user = await db.collection('UserData').find(query_username).limit(1).toArray();
        var result_availability;
        if (result_user[0]["position"] == "student") {
            result_availability = await db.collection('ContractData').find(query_student_availability).toArray();
        }
        else {
            result_availability = await db.collection('ContractData').find(query_tutor_availability).toArray();
        }
        const result_course = await db.collection('CourseData').find(query_tutor_username).toArray();

        const result_comment = await db.collection('CommentController').find(comment).toArray();
        // The search added the results to the locals, access them in home.ejs and show the results there
        console.log(result_availability);
        res.render('profile_admin', {
            pf: result_user[0], searchCourse: result_course,
            searchAvailability: result_availability, comment: result_comment, role: req.cookies.role
        });
    });
});


router.post('/profile_admin/:username/edit_profile', [], function (req, res) {

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
        res.cookie('firstn', req.body.firstname);
        const result = await db.collection('UserData').find({ username: req.cookies.auth }).limit(1).toArray();
        console.log(result);
        res.redirect('back');
    });

});


router.post('/profile_admin/:username/edit_availability', [], function (req, res) {

    //edit availability using req.params.username here

    res.redirect('back');
});


router.post('/profile_admin/:commentid/delete_comment', [], function (req, res) {


    res.redirect('back');
});

module.exports = router;