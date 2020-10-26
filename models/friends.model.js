const mongoose = require('mongoose') ; 

const User= require('../models/auth.model').User ; 
const Chat  = require('../models/chat.model').Chat ;





exports.getNotifications = async (userId)=>{
    try {
        const userDoc = await User.findById(userId) ;
        return userDoc.notifications ;
    } catch (error) {
        throw new Error(error)
    }
}

exports.editNotificationState = async (userId,ntfId)=>{
    try {
        const userDoc = await User.findById(userId) ;
        let notifications = userDoc.notifications ;
        let index = notifications.findIndex(el => el._id == ntfId) ;
        notifications[index].isViewed = true ;
        await userDoc.save(); 
    } catch (error) {
        throw new Error(error)
    }
}


exports.getFriends =  async (userId)=>{
    try {
        let friends = await User.findById(userId,'friends').populate({
            path:'friends' ,
            populate : {
                path:'id' ,
                model : 'user' , 
                select : 'name image' , 
            } 
        }) ; 
        return friends
    } catch (error) {
        throw new Error(error)
    }
}

exports.getFriendRequsets =  async (userId)=>{
    try {
        let friendRequsets = await User.findById(userId).populate({
            path:'friendRequests' , 
            model : 'user' , 
            select : 'name image' , 
        }) ; 
        return friendRequsets.friendRequests ;
    } catch (error) {
        throw new Error(error)
    }
}

exports.getSentRequsets =  async (userId)=>{
    try {
        let sentRequsets = await User.findById(userId).populate({
            path:'sentRequests' , 
            model : 'user' , 
            select : 'name image' , 
        }) ; 
        return sentRequsets.sentRequests ;
    } catch (error) {
        throw new Error(error)
    }
}

exports.getRequests =  async (userId)=>{
    try {
        let requests = await User.findById(userId,'friends friendRequests sentRequests').populate({
            path:'friendRequests' , 
            model : 'user' , 
            select : '_id' , 
        }).populate({
            path:'sentRequests' , 
            model : 'user' , 
            select : '_id' , 
        });
        return requests ;
    } catch (error) {
        throw new Error(error)
    }
}
exports.addFriendRequest = async (senderId,recieverId)=>{
    try {
        let reciever = await User.findById(recieverId) ; 
        reciever.friendRequests.push(senderId) ;
        let sender = await User.findById(senderId) ; 
        sender.sentRequests.push(recieverId) ;
        Promise.all([
            await sender.save() ,
            await reciever.save() 
        ])
    } catch (error) {
        throw new Error(error)
    }
}


exports.cancelFriendRequest = async (senderId,recieverId)=>{
    try {
        let sender = await User.findById(senderId) ; 
        let reciever = await User.findById(recieverId) ; 
        sender.sentRequests = sender.sentRequests.filter(el => String(el) != String(recieverId) )
        reciever.friendRequests = reciever.friendRequests.filter(el => String(el) !== String(senderId) )
        Promise.all([
            await sender.save() ,
            await reciever.save() 
        ])
    } catch (error) {
        throw new Error(error)
    }
}

exports.confirmRequest = async (senderId,recieverId)=>{
    try {

        let chats = await Chat.find({}) ; 
        //console.log(chats)
        let chatFoundId
        for(let chat of chats){
            if(chat.users.length == 2 && chat.users.includes(recieverId) && chat.users.includes(senderId)){
                //console.log('here2')
                chatFoundId = chat._id ; 
                break ;
            }
        }

        let newChat = new Chat({
            users:[senderId,recieverId]
        })
        let chatDoc = await newChat.save();
        
        Promise.all([
            await User.updateOne({_id:senderId},
                {$push:
                    {friends:
                        {
                            id:recieverId,
                            chatId: chatFoundId ? chatFoundId : chatDoc.id,
                            date:Date.now()
                        }
                    }
                }),
                await User.updateOne({_id:recieverId},
                    {$push:
                        {friends:
                            {
                                id:senderId,
                                chatId: chatFoundId ? chatFoundId : chatDoc.id,
                                date:Date.now()
                            }
                        }
                    })

        ])
        
        let sender = await User.findById(senderId) ; 
        let reciever = await User.findById(recieverId) ; 
        sender.sentRequests = sender.sentRequests.filter(el => String(el) != String(recieverId) )
        reciever.friendRequests = reciever.friendRequests.filter(el => String(el) !== String(senderId) )
        Promise.all([
            await sender.save(),
            await reciever.save()
        ])
    } catch (error) {
        throw new Error(error)
    }
}


exports.rejectRequest = async (senderId,recieverId)=>{
    try {
        let sender = await User.findById(senderId) ; 
        let reciever = await User.findById(recieverId) ; 
        sender.sentRequests = sender.sentRequests.filter(el => String(el) != String(recieverId) )
        reciever.friendRequests = reciever.friendRequests.filter(el => String(el) !== String(senderId) )
        Promise.all([
            await sender.save(),
            await reciever.save()
        ])
    } catch (error) {
        throw new Error(error)
    }

}

exports.removeFriend = async (removerId,removedId)=>{
    try {
        let remover =  await User.findById(removerId) ; 
        let removed = await User.findById(removedId) ; 
        remover.friends = remover.friends.filter(el => String(el.id) !== String(removed._id) )
        removed.friends = removed.friends.filter(el => String(el.id) !== String(remover._id) )        
        Promise.all([
            await remover.save() , 
            await removed.save()
        ])
    } catch (error) {
        throw new Error(error)
    }
}









