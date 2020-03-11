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

router.get('/remove/:id', function (req, res) {
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"_id": new ObjectId(id);
		};
		await db.collection('ContractData').deleteOne(query);
	});
	res.render('tutors_contract');
});


module.exports = router;