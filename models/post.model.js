const mongoose = require('mongoose') ; 
const postSchema = mongoose.Schema({
    authorId : {type:mongoose.Schema.Types.ObjectId , ref:'user'} , 
    likes : [{    
        id : {type:mongoose.Schema.Types.ObjectId , ref:'user'} ,   
        date : Date ,    
    }]  , 
    comments : [{
        commenterId : {type:mongoose.Schema.Types.ObjectId , ref:'user'} , 
        isEdited : {type:Boolean , default:false} ,
        text : String , 
    }],
    image : {type:String,default:null} , 
    text : String , 
    isEdited : { type : Boolean , default:false } ,
    date:Date
})

const Post = mongoose.model('post',postSchema) ;
const User = require('../models/auth.model').User ; 



exports.getUserInfo = async (userId)=>{
    try {
        let info = await User.findById(userId,'name image') ;
        return info ;
    } catch (error) {
        throw new Error(error)
    }

}

exports.getUserPosts = async userId =>{
   try {
    let posts = await Post.find({authorId:userId},{},{sort:{date:-1}}).populate({
        path:'comments',
        populate : {
            path:'commenterId' , 
            model : 'user' , 
            select : 'name image'
        }
    });
    return posts ;
   } catch (error) {
       throw new Error(error);
   }
}





exports.getAllOfCurrentUser = async userId =>{
    try {
      let data =   await User.findById(userId).populate({
            path : 'friends' , 
            select : 'id' ,
            populate : {
                path:'id',
                model : 'user' , 
                select : 'name image posts' , 
            populate : {
                path : 'posts' , 
                populate : [{
                    path:'authorId' ,
                    model:'user',
                    select : 'name image' ,
                } ,{
                    path : 'likes' , 
                    populate: {
                        path : 'id' , 
                        model : 'user' , 
                        select:'name image'
                    }
                } , {
                    path:'comments' , 
                    populate : {
                        path:'commenterId' , 
                        model : 'user' , 
                        select : 'name image'
                    }
                }]
            }
            }
        })
        return data ;
    } catch (error) {
        console.log(error)
        //throw new Error(error)
        
    }
}


exports.getPost = async postId =>{
    try {
        let post = await Post.findById(postId).populate({
            path : 'authorId' ,
            model:'user' ,
            select : 'name image' 
        }).populate({
            path : 'likes' , 
            model : 'user' , 
            select : 'name image'
        }).populate({
            path:'comments' ,
            populate : {
                path: 'commenterId' , 
                model : 'user' , 
                select : 'name image'
            }
        }); 
        return post ; 
    } catch (error) {
        throw new Error(error) ;
    }
}


exports.addNewPost = async data => {
    try {
        let newPost = new Post({
            authorId : data.id , 
            text : data.text ,  
            image : data.image ? data.image : null , 
            date: Date.now()
        })
        let postDoc = await newPost.save();
        let user = await User.findById(data.id) ; 
        user.posts.push(postDoc) ; 
        await user.save();
        return postDoc
    } catch (error) {
        throw new Error(error) ;
    }
}


exports.editPost = async (postId,newText) =>{
    try {
        let post = await Post.findById(postId) ; 
        post.text = newText  ; 
        post.isEdited = true ; 
        post.date = Date.now() ;
        await post.save(); 
    } catch (error) {
        throw new Error(error)
    }
}

exports.deletePost = async (userId,postId)=>{
    try {
       Promise.all([
        await Post.deleteOne({_id:postId}) ,
        await User.updateOne({_id:userId} , {$pull:{posts:{id:postId}}})
       ])
    } catch (error) {
        throw new Error(error)
    }
}


exports.addLike = async (userId,OwnerId,postId) =>{
    try {
        await Post.updateOne({_id:postId} , {$push:{likes:{id:userId,date: Date.now()}}}) ; 
        let post = await Post.findById(postId);
        let likeId = post.likes[post.likes.length-1]._id
        let likerDoc = await User.findById(userId);
        let ownerDoc = await User.findById(OwnerId) ;
        ownerDoc.notifications.push({
            notification : `${likerDoc.name} liked your post` , 
            postId ,
            isViewed:false ,
            likeId ,
            date : Date.now()
        })
        //console.log(likeId)
        await ownerDoc.save();
        return ownerDoc.notifications[ownerDoc.notifications.length-1] ;
    } catch (error) {
        throw new Error(error)
    }
}

exports.dislike = async (userId,ownerId,postId,likeId) => {
    try {
        await Post.updateOne({_id:postId} , {$pull:{likes:{_id:likeId}}}) ; 
        let ownerDoc = await User.findById(ownerId) ; 
        let index = ownerDoc.notifications.findIndex(el => el.likeId == likeId) ;
        ownerDoc.notifications.splice(index,1);
        await ownerDoc.save()
    } catch (error) {
        throw new Error(error)
    }
}

exports.addComment = async (userId,postId,comment,ownerId) =>{
    try {
        await Post.updateOne({_id:postId},{$push:{comments:{commenterId:userId , text:comment , date: Date.now()}}})
            let post = await Post.findById(postId);
            let commentDoc = post.comments[post.comments.length-1] ;
            let commenterDoc = await User.findById(userId);
            let ownerDoc = await User.findById(ownerId) ;
            ownerDoc.notifications.push({
                notification : `${commenterDoc.name} commented on your post` , 
                postId ,
                isViewed:false ,
                commentId : commentDoc._id ,
                date : Date.now()
            })
            await ownerDoc.save();
            let notification = ownerDoc.notifications[ownerDoc.notifications.length-1] ;
            return {
                notification , 
                comment : commentDoc
            }
    } catch (error) {
        throw new Error(error) ;
    }
}


exports.editComment = async (postId , commentId,newComment) => {
    try {
        const post = await Post.findOne({_id:postId}) ; 
        let comment = post.comments.find(el => el._id == commentId);
        comment.text = newComment ; 
        comment.isEdited = true ;
        comment.date = Date.now()
        await post.save();
    } catch (error) {
        throw new Error(error)
    }
}


exports.deleteComment = async (commentId , postId ,ownerId) => {
    try {
        await Post.updateOne({_id:postId} ,
            {
                 $pull:
                {
                     comments:{_id:commentId}
                }
            })

            let ownerDoc = await User.findById(ownerId) ; 
            let index = ownerDoc.notifications.findIndex(el => el.commentId == commentId) ;
            if(index != undefined) ownerDoc.notifications.splice(index,1);
            await ownerDoc.save()
    } catch (error) {
        throw new Error(error)
    }
}












