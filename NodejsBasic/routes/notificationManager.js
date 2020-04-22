var databaseInterface = require('./database.js');
module.exports = {
notify:function(recipientID, messageType){
    databaseInterface.create(recipientID,messageType);
}
,
toggleSeen:function ( userID ){
    databaseInterface.update(userID);
}
,
getNotificationForUser: async function (userId ){
    //console.log("getNotiTITITIITI!!!!!");
    var result = await databaseInterface.find(userId);
    return result;
},
    
deleteNotificationForUser:function(notificationID ){
    databaseInterface.deleteNoti(userId);
}
}