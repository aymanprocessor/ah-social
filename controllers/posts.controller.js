const postsModel  = require('../models/post.model') ; 




exports.getUserInfo = (req,res) =>{
    let id = req.header('id') ;
    postsModel.getUserInfo(id).then(data =>{
        res.json(data)
    }).catch(err => res.json('unexpected error'))
}

exports.getAllOfCurrentUser = (req,res) => {
    let id = req.header('id') ;
    postsModel.getAllOfCurrentUser(id).then(data => {
        res.json(data)
    }).catch(err => res.json('unexpected error'))
}

exports.getPost = (req,res)=>{
    postsModel.getPost(req.header('id')).then(post =>{
        if(post) res.json(post) 
        else res.json('err')
    }).catch(err => res.json('err'))
}

exports.getCurrentUserPosts = (req,res)=>{
    const id = req.header('id') ;
    postsModel.getUserPosts(id).then(posts =>{
        res.json(posts)
    }).catch(err => {
        res.json('something wrong')
    })
}

exports.addNewPost = (req,res)=>{
    
    let data = JSON.parse(req.body.data);
    postsModel.addNewPost({
        id: data.id , 
        text : data.text , 
        image : req.file ? req.imageURL : null
    }).then(newPost =>{
        res.json({
            msg : 'post added successfully' ,
            newPost
        })
    }).catch(err => res.json('unexpected error'))
    
}

exports.editPost = (req,res)=>{
    postsModel.editPost(req.body.postId,req.body.newText).then(()=>{
        res.json({
            msg : 'post updated successfully'
        })
    }).catch(err => res.json('unexpected error'))
}


exports.deletePost = (req,res)=>{
    postsModel.deletePost(req.header('userId'),req.header('postId')).then(()=>{
        res.json({
            msg : 'post deleted successfully'
        })
    }).catch(err => res.json('unexpected error'))
}


exports.dislike = (req,res) => {
    postsModel.dislike(req.header('userId'),req.header('ownerId'),req.header('postId'),req.header('likeId'))
    .then(()=>{
        res.json({
            msg:'like removed successfully'
        })
    }).catch(err => res.json('unexpected error'))
    
}


exports.addComment = (req,res) => {
    postsModel.addComment(req.body.userId , req.body.postId , req.body.comment).then(commentDoc =>{
        res.json({
            msg : 'comment added successfully' ,
            commentDoc
        })
    }).catch(err => res.json('unexpected error'))
}

exports.editComment = (req,res) => {
    postsModel.editComment(req.body.postId , req.body.commentId , req.body.newComment).then(()=>{
        res.json({
            msg : 'comment updated successfully'
        })
    }).catch(err => res.json('unexpected error'))
}


exports.deleteComment = (req,res) => {
    postsModel.deleteComment(req.header('commentId') , req.header('postId')).then(()=>{
        res.json({
            msg:'comment deleted successfully'
        })
    })
}



