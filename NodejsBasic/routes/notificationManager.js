var databaseInterface = require('./database.js');
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