var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var databaseInterface = require('./database.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function notify(recipientID, messageType){
    databaseInterface.create(recipientID,messageType);
}

function toggleSeen( notificationID ){
    databaseInterface.update(notificationID);
}

function getNotificationForUser(userId ){
    databaseInterface.find(userId);
}
function deleteNotificationForUser(notificationID ){
    databaseInterface.deleteNoti(userId);
}


