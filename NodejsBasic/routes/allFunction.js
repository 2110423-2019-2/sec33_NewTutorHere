var methods = {};
var express = require('express');
var router = express.Router();
//connect to allFunction.js
var testFunction = require('./allFunction');

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
methods.myTestFunction = function(req ,res ){
    res.send(req.cookies.auth);
    
}
methods.createCookie = function(req ,res ){
    res.cookie('nextpf', req.result.tutor_username);
}
// function sendContract(req){
//     var use = req.cookies.nextpf;
// 	//if(req.cookies.auth == req.body.username)
// 	console.log("IN SENDCONTRACT FUNCTION!");
// 		client.connect(async function (err) {
// 			//checks for connection error
// 			assert.equal(null, err);
	
// 			//once connected, add a doc to collection 'UserData'
// 			const db = client.db(dbName);
// 			db.collection('ContractData').insertOne({
// 				tutor_username : req.cookies.nextpf,
// 				student_username: req.cookies.auth,
// 				course_name : req.body.subject,
// 				educational_level : req.body.level,
// 				class_day :  req.body.day,
// 				class_time :  req.body.time,
// 				status : "requested",
// 				message : req.body.bio

// 			});
			
// 		// The search added the results to the locals, access them in home.ejs and show the results there
		
// 		const resultt = await db.collection('UserData').find({username: req.cookies.auth }).limit(1).toArray();
// 		console.log(resultt);
// 		res.render('profile', { pf: resultt[0] });
// 		});
// }


exports.data = methods;