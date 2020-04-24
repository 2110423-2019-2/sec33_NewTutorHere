var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const { check, validationResult } = require('express-validator');

module.exports = {
    find: async function (userID) {
        const MongoClient = require('mongodb').MongoClient;
        const dbName = 'SEproject'
        const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });

        var userNotify;

        await client.connect();
        
        const db = client.db(dbName);
        var query1 = {
            "username": userID
        };
        userNotify = await db.collection('NotifyController').find(query1).toArray();
        console.log("userNotify = ", userNotify);
        return userNotify;

    },
    findUnseen: async function (userID) {
        const MongoClient = require('mongodb').MongoClient;
        const dbName = 'SEproject'
        const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });



        await client.connect();
        
        const db = client.db(dbName);
        var query2 = {
            "username": userID,
            "status" : 0
        };
        s = await db.collection('NotifyController').find(query2).toArray();
        console.log("list = " +s + "  ;");
        return s;

    },
    create: function (recipientID, messageType) {
        var message = "";
        const MongoClient = require('mongodb').MongoClient;
        const dbName = 'SEproject'
        const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });

        if (messageType == 0) message = "You receive a new contract!";
        else if (messageType == 1) message = "Your contract request is accepted.";
        else if (messageType == 2) message = "Your contract request is rejected.";
        else if (messageType == 3) message = "Your contract is terminated";
        else if (messageType == 4) message = "Your comment is deleted.";
        else if (messageType == 5) message = "Your comment is deleted by admin.";
        client.connect(async function (err) {
            const db = client.db(dbName);
            db.collection("NotifyController").insertOne({
                "username": recipientID,
                "message": [message][0],
                "status": 0
            });

        });
    },
    update: function (userID) {
        const MongoClient = require('mongodb').MongoClient;
        const dbName = 'SEproject'
        const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });
console.log("status=1");
        var query = {
            "username": userID
        };
        client.connect(async function (err) {
            const db = client.db(dbName);
            db.collection('NotifyController').updateMany(query, {
                $set: {
                    "status": 1
                }
            });
        });
    },
    deleteNoti: function (notificationID) {
        const MongoClient = require('mongodb').MongoClient;
        const dbName = 'SEproject'
        const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        const db = client.db(dbName);
        var query = {
            "_id": ObjectID(notificationID)
        };
        client.connect(async function (err) {
            db.collection('NotifyController').remove(query);
        });
    }
}