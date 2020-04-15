var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var databaseInterface = require('./database.js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
module.exports = {
notify:function(recipientID, messageType){
    databaseInterface.create(recipientID,messageType);
}
,
toggleSeen:function ( notificationID ){
    databaseInterface.update(notificationID);
}
,
getNotificationForUser:function (userId ){
    databaseInterface.find(userId);
},
deleteNotificationForUser:function(notificationID ){
    databaseInterface.deleteNoti(userId);
}
}