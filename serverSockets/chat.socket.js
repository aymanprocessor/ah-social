const chatModel = require('../models/chat.model') ; 
module.exports = socketIo =>{
    socketIo.on('connection' , client =>{
        client.on('newMsg' , data =>{
            chatModel.newMessage(data).then(resp =>{
                resp['newMessage'].type = 'private'
                if(resp['msg']) {
                    socketIo.to(data.senderId).emit('msgSent',resp['newMessage']);
                    socketIo.to(data.recieverId).emit('msgRecieved',resp['newMessage']);
                }
            }).catch(err => console.log(err))
        })

        /*
        client.on('createGroup' , data =>{
            chatModel.createGroup(data).then(groupId =>{
                client.join('room-'+groupId) ;
            }).catch(err => console.log(err))
        })

        client.on('joinGroup' , data =>{
            chatModel.checkGroupMembers(data).then(found =>{
                if(found){
                    socketIo.to(data.userId).emit('joinedGroupS') ;
                }
            }).catch(err => console.log(err))
        })
        */

        client.on('newGroupMsg' , data =>{
            chatModel.newMessage(data).then(resp =>{
                let msg = resp['newMessage'] ; 
                msg = JSON.parse(JSON.stringify(msg))
                msg.type = 'group'
                //console.log(msg)
                //console.log(resp,data)
                if(resp['msg']){
                    //resp['newMessage']['message'] = data.message ; 
                    for(member of resp['membersIds']['users']){
                        socketIo.to(member._id).emit('newGbMsg',msg);
                    }
                }
            }).catch(err => console.log(err))
        })
    })
}