const chatModel = require('../models/chat.model');

exports.getChat = (req,res)=>{
    const chatId = req.header('chatId') ;
    chatModel.getChat(chatId).then(chatInfo =>{
        if(chatInfo){
            chatModel.getChatMessages(chatId).then(messages =>{
                let chat = {
                    chatInfo , 
                    messages
                }
                res.json(chat)
            })
        }else res.json('err')        
        
    }).catch(err => res.json('err') )
}

exports.addNewMessage = (req,res) =>{
    chatModel.newMessage(req.body.data).then(resp =>{
        if(resp['msg']) res.json(resp['msg']) ;
    }).catch(err => res.json('unexpected error'))
}

exports.getAllChats = (req,res)=>{
    //console.log(req.header('userId'))
    chatModel.getAllChats(req.header('userId')).then(lastMessages =>{
        //console.log(lastMessages)
        res.json(lastMessages)
    })
}



exports.createGroup = (req,res) =>{
    chatModel.createGroup(req.body.data).then(()=>{
        res.json('created')
    }).catch(err => res.json('unexpected error'))
}


exports.joinGroup = (req,res) =>{
    chatModel.checkGroupMembers(req.body.data).then(joined =>{
        res.json(joined)
    }).catch(err => res.json('unexpected error'))
}

exports.getGroups = (req,res) =>{
    chatModel.getGroups(req.header('userId')).then(groups =>{
        res.json(groups)
    }).catch(err => res.json('unexpected error'))
}


