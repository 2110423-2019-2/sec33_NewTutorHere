var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { check, validationResult } = require('express-validator');
const dbName = 'SEproject'
const db = client.db(dbName);
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
function find( userID ){
    client.connect(async function (err) {
           assert.equal(null, err);
           var query = {
               "username": userID
           };
           userNotify = await db.collection('NotifyController').find(query).toArray();
            return  userNotify
          });
}
function create( recipientID , messageType ){
    var message ;
    if(messageType ==0) message = "You receive a new contract!";
     else if(messageType ==1) message = "Your contract request is accepted." ;
     else if(messageType ==2) message = "Your contract request is rejected." ;
     else if(messageType ==3) message = "Your contract is terminated" ;
     else if(messageType ==4) message = "Your comment is deleted." ;
     else if(messageType ==5) message = "Your comment is deleted by admin." ;
       db.collection("NotifyController").insertOne({
             "username" : recipientID,
                        "message" :    [message],
                        "status" :   0
       });
}
function update( notificationID ){
	var query = {
			"_id": ObjectID(notificationID)
		        };
	db.collection('NotificationController').updateOne(query, {
			$set: {
				"status": 1
			}
		});
}
function deleteNoti( notificationID ){
    var query = {
                "_id" : ObjectID(notificationID)
            };
           db.collection('NotifyController').remove(query);
    }
    