const friendsModel = require('../models/friends.model') ; 
const postModel = require('../models/post.model') ;


module.exports = socketIo =>{
    socketIo.on('connection' , client =>{

        client.on('addFriend' , data =>{
            friendsModel.addFriendRequest(String(data.sender._id) , String(data.reciever._id)).then(()=>{
                socketIo.to(data.sender._id).emit('addRequestSent', data) ; 
                socketIo.to(String(data.reciever._id)).emit('addRequestRecieved' , data) ;
            }).catch(err => console.log(err))
        })

        client.on('cancelRequest' , data =>{
            friendsModel.cancelFriendRequest(String(data.sender._id) , String(data.reciever._id)).then(()=>{
                socketIo.to(data.sender._id).emit('requestCanceledSuccessfully', data) ; 
                socketIo.to(String(data.reciever._id)).emit('requestCanceled' , data) ;
            }).catch(err => console.log(err))
        })

        client.on('confirmRequest' , data =>{
            friendsModel.confirmRequest(String(data.sender._id) , String(data.reciever._id)).then(()=>{
                socketIo.to(data.reciever._id).emit('requestConfirmedS', data) ; 
                socketIo.to(String(data.sender._id)).emit('requestConfirmed' , data) ;
            }).catch(err => console.log(err))
        })

        client.on('rejectRequest' , data =>{
            friendsModel.rejectRequest(String(data.sender._id) , String(data.reciever._id)).then(()=>{
                socketIo.to(data.reciever._id).emit('requestRejectedS', data) ; 
                socketIo.to(String(data.sender._id)).emit('requestRejected' , data) ;
            }).catch(err => console.log(err))
        })

        client.on('removeFriend' , data =>{
            friendsModel.removeFriend(String(data.remover) , String(data.removed)).then(()=>{
                socketIo.to(data.remover).emit('removingDone', data) ; 
                socketIo.to(String(data.removed)).emit('youRemoved' , data) ;
            }).catch(err => console.log(err))
        })

        client.on('addLike' , data => {
            postModel.addLike(data.adder,data.postOwner,data.postId).then(notification =>{
                data['notification'] = notification ;
                socketIo.to(data.adder).emit('likeAddedS',data) ;
                socketIo.to(data.postOwner).emit('likeAdded',data) ;
            }).catch(err => console.log(err))
        }) 
        
        client.on('dislike' , data => {
    
            postModel.dislike(data.adder,data.postOwner,data.postId,data.likeId).then(() =>{
                socketIo.to(data.adder).emit('dislikedS',data) ;
                socketIo.to(data.postOwner).emit('disliked',data) ;
            }).catch(err => console.log(err))
        })
        
        client.on('addComment',data =>{
            postModel.addComment(data.userId,data.postId,data.comment,data.postOwner).then(resp =>{
                data.notification = resp['notification'] ;
                data.comment = resp['comment']
                socketIo.to(data.userId).emit('commentAddedS',data) ;
                socketIo.to(data.postOwner).emit('commentAdded',data) ;
            }).catch(err => console.log(err))
        })

        client.on('deleteComment',data =>{
            postModel.deleteComment(data.commentId,data.postId,data.postOwner).then(() =>{
                socketIo.to(data.commenterId).emit('commentDeletedS',data) ;
                socketIo.to(data.postOwner).emit('commentDeleted',data) ;
            }).catch(err => console.log(err))
        })
        
    })
}