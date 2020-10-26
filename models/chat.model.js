const mongoose = require('mongoose') ; 

const chatSchema = mongoose.Schema({
    users : [{type:mongoose.Schema.Types.ObjectId,ref:'user'}]
})

const Chat = mongoose.model('chat',chatSchema) ; 

const messageSchema = mongoose.Schema({
    chat : {type:mongoose.Schema.Types.ObjectId,ref:'chat'} , 
    senderId : {type:mongoose.Schema.Types.ObjectId,ref:'user'} , 
    recieverId : {type:mongoose.Schema.Types.ObjectId,ref:'user'} , 
    seen : {type:Boolean , default:false} , 
    date : Date , 
    content: String , 
})

const Message = mongoose.model('message',messageSchema) ; 
const User = require('../models/auth.model').User ;
exports.Chat = Chat ; 


exports.newMessage = async (data)=>{
    try {
        let newMessage = new Message({
            chat: data.chatId  , 
            senderId : data.senderId,
            date : Date.now() , 
            content : data.content 
        })
        await newMessage.save();
        let membersIds = await Chat.findById(data.chatId).populate({
            path:'users' ,
            model:'user' , 
            select : '_id'
        }) 

        let senderInfo = await User.findById(data.senderId,'name image') ;
        newMessage.senderId = senderInfo
        return {msg:'saved' , newMessage , membersIds} ;
    } catch (error) {
        throw new Error(error)
    }
}


exports.getChat = async (chatId)=>{
    try {
        let chatInfo = await Chat.findById(chatId).populate({
            path:'users' , 
            model : 'user' , 
            select : 'name image'
        })    
        return chatInfo
    } catch (error) {
        throw new Error(error)
    }    

}


exports.getChatMessages = async (chatId) =>{
    try {
        let messages = await Message.find({chat:chatId},'senderId seen content',{sort:{date:1}}).populate({
            path:'senderId' , 
            model : 'user' , 
            select : '_id name image'
        })
        return messages
    } catch (error) {
        throw new Error(error)
    }
}


exports.getAllChats = async (userId) =>{
    try {
        let chats = await Chat.find() ;
        let chatIds  = []
        if(chats){
            for(chat of chats){
                if(chat.users.length == 2 && chat.users.includes(userId)) chatIds.push(chat._id)
            }
        }
        let lastMessages = [] ;
        for(let i=0 ; i< chatIds.length ;i++) { 
           let message = await Message.find({chat:chatIds[i]}).populate({
               path:'chat' , 
               populate : {
                   path:'users' , 
                   model : 'user' , 
                   select : 'name image'
               }
           }).populate({
            path:'senderId' , 
            model : 'user' , 
            select : 'name image'
           })
           if(message.length !=0) lastMessages.push(message[message.length-1]) ;
        }

        //console.log(lastMessages)
        return (lastMessages.reverse()) ;
    } catch (error) {
        throw new Error(error)   
    }

}



exports.createGroup = async (data)=>{
    try {
        let newGroup = new Chat({
            users : data.members
        })
        await newGroup.save() ; 
        let groupId = newGroup._id ; 
        for(let i=0 ;i < data.members.length ; i++){
            let user = await  User.updateOne({_id:data.members[i]},{
                $push:{
                    groups:{
                            admin : data.members[0] ,
                            groupId , 
                            name : data.name 
                        }
                    }
                })
        }
        return String(groupId)
    } catch (error) {
        throw new Error(error)
        
    }
}




exports.checkGroupMembers = async (data)=>{
    try {
        let user = await User.findById(data.userId) ; 
        for(let i=0 ; i<user.groups.length ; i++){
            let found = user.groups.find(el => String(el.groupId) == String(data.groupId))
            if(found) return true 
        }
        return false 
    } catch (error) {
        throw new Error(error)
    }
}



exports.getGroups = async userId =>{
    try {
        let groups =  User.findById(userId , 'groups').populate({
            path:'groups' , 
            populate : {
                path:'admin' , 
                model : 'user' , 
                select : 'name'
            }
        })
        return groups ; 
    } catch (error) {
        throw new Error(error)
        
    }
}



















