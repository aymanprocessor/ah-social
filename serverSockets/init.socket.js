const authModel = require('../models/auth.model') ; 

module.exports = socketIo =>{
    socketIo.on('connection' , client =>{

        client.on('createUserRoom' , idOfUser =>{
            client.join(idOfUser) ;
        })

        client.on('activeNow' , userData=>{
            userData._id = userData.id;
            socketIo.activeUsers[userData.id] = true ; 
            let friends = []
            authModel.getUserFriends(userData.id).then(friendsArray =>{
                friends = friendsArray ; 
                for (let friend of friends){
                    socketIo.to(friend.id._id).emit('friendGotOnline' , userData);
                }
            })
            //client.broadcast.emit('friendGotOnline' , userData);
            client.on('disconnect' , ()=>{
                socketIo.activeUsers[userData.id] = false ; 
                //client.broadcast.emit('friendGotOffline' , userData);
                for (let friend of friends){
                    socketIo.to(friend.id._id).emit('friendGotOffline' , userData);
                }
            })  
        })

        client.on('customDisconnect' , dataOfUser =>{
            if(dataOfUser && dataOfUser.id) {
                dataOfUser._id = dataOfUser['id'] ; 
                socketIo.activeUsers[dataOfUser.id] = false ; 
                authModel.getUserFriends(dataOfUser.id).then(friendsArray =>{
                    for (let friend of friendsArray){
                        socketIo.to(friend.id._id).emit('friendGotOffline' , dataOfUser);
                    }
                })
                //client.broadcast.emit('friendGotOffline' , dataOfUser);
            }
        })

        client.on('getOnlineFriends' , userId =>{
            let onlineFriends = []
            authModel.getUserFriends(userId).then(friendsArray =>{              
                for(let i=0 ; i<friendsArray.length ;i++) {
                    if(socketIo.activeUsers[friendsArray[i].id._id]) onlineFriends.push(friendsArray[i].id)
                }
                socketIo.to(userId).emit('onlineFriends',onlineFriends) ;
            })

        })


        
    })
}