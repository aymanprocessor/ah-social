
const friendsModel = require('../models/friends.model') ; 




exports.getNotifications = (req,res) =>{
    friendsModel.getNotifications(req.header('userId')).then(notifications=>{
        res.json(notifications)
    }).catch(err => res.json('unexpected error'))
}

exports.editNotification = (req,res) =>{
    friendsModel.editNotificationState(req.body.userId,req.body.id).then(()=>{
        res.json({msg:'edited'})
    }).catch(err => res.json('unexpected error'))
}


exports.getFriends = (req,res)=>{
    friendsModel.getFriends(req.header('userId')).then(friends=>{
        res.json(friends)
    }).catch(err => res.json('unexpected error'))
}

exports.getFriendRequsets = (req,res)=>{
    friendsModel.getFriendRequsets(req.header('userId')).then(friendRequests=>{
        res.json(friendRequests)
    }).catch(err => res.json('unexpected error'))
}

exports.getSentRequsets = (req,res)=>{
    friendsModel.getSentRequsets(req.header('userId')).then(sentRequests=>{
        res.json(sentRequests)
    }).catch(err => res.json('unexpected error'))
}

exports.getRequests = (req,res)=>{
    friendsModel.getRequests(req.header('id')).then(requests=>{
        res.json(requests)
    }).catch(err => res.json('unexpected error'))
}

exports.addFriendRequest = (req,res)=>{
    friendsModel.addFriendRequest(req.body.senderId , req.body.recieverId).then(()=>{
        res.json({
            msg:'add Request sent'
        })
    }).catch(err => res.json('unexpected error'))
}


exports.cancelFriendRequest = (req,res)=>{
    friendsModel.cancelFriendRequest(req.body.senderId , req.body.recieverId).then(()=>{
        res.json({
            msg:'cancel Request sent'
        })
    }).catch(err => res.json('unexpected error'))
}

exports.confirmFriendRequest = (req,res)=>{
    friendsModel.confirmRequest(req.body.senderId , req.body.recieverId).then(()=>{
        res.json({
            msg:'confirm Request sent'
        })
    }).catch(err => res.json('unexpected error'))
}

exports.removeFriend = (req,res)=>{
    friendsModel.removeFriend(req.body.senderId , req.body.recieverId).then(()=>{
        res.json({
            msg:'remove Request sent'
        })
    }).catch(err => res.json('unexpected error'))
}





