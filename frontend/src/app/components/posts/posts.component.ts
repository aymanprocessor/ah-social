import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import * as io from 'socket.io-client' ;
import { Store } from '@ngrx/store';
import jwt_decode from "jwt-decode";



@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit , OnDestroy {

  post 
  currentUserInfo = jwt_decode(localStorage.getItem('token')) ;
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  response = false ;
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  mySub3 : Subscription ;
  mySub4 : Subscription ;


  constructor(private rou:ActivatedRoute,private router:Router,
    private profileSer:ProfileService,private store:Store , private title:Title){
      title.setTitle('posts')
    rou.queryParamMap.subscribe(params =>{
      if(params.get('id')) {
        let postId= params.get('id');
        this.mySub1 = profileSer.getPost(postId).subscribe(resp =>{
          if(resp && resp=='unexpected error') this.router.navigate(['/error'])
          if(resp == 'err') router.navigate(['/404'])
          else this.post = resp ;
          this.response = true
        })
      }else router.navigate(['/']);
    })

    store.subscribe(data =>{
      if(data['notificationsReducer']['notificationType']=='likeAddedS') {
        if(!this.post?.likes.find(el => el._id == data['notificationsReducer']?.likeId)){
        this.post?.likes.push({
          _id : data['notificationsReducer']['likeId'],
          id:this.currentUserInfo.id , 
          date:Date.now()
        })
       }
      }
       if(data['notificationsReducer']['notificationType']=='dislikedS') {
        let indexOfLiker = this.post?.likes.findIndex(el => el._id == data['notificationsReducer']['likeId']) ;
        this.post?.likes.splice(indexOfLiker,1) ;
       }
       if(data['notificationsReducer']['notificationType']=='commentAddedS') {  
        if(!this.post.comments.find(el => el._id === data['notificationsReducer']?.comment?._id)){
        let comment = data['notificationsReducer']['comment'] ;
        this.post?.comments.push({
          _id : comment._id ,
          text:comment.text , 
          isEdited : comment.isEdited ,
          commenterId : {
            _id : this.currentUserInfo.id , 
            name : this.currentUserInfo.name , 
            image : this.currentUserInfo.image
          }
        }) ;
       }}
       if(data['notificationsReducer']['notificationType']=='commentDeletedS') {
        let commentIndex = this.post?.comments.findIndex(el => el._id == data['notificationsReducer']['commentId'] ) ; 
        this.post?.comments.splice(commentIndex,1);
       }
     })
  }

  ngOnInit(): void {
    $.when( $.ready ).then(function() {
      $('.likeBtn').on('click' , function(){
        $(this).toggleClass('blue')
      })
      });
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
    if(this.mySub3) this.mySub3.unsubscribe();
    if(this.mySub4) this.mySub4.unsubscribe();
  }

  checkLike(postId){
    return this.post.likes?.find(el => el.id == this.currentUserInfo.id)
  }

  showBox = (oldText,ff)=>{
    document.getElementById(oldText.id).setAttribute('hidden',''); 
    document.getElementById(ff.id).removeAttribute('hidden');       
  }

  editPost(f:NgForm,oldText,ff){ 
    document.getElementById(oldText.id).setAttribute('hidden',''); 
    document.getElementById(ff['id']).removeAttribute('hidden');  
    const postId = ff.id ;
    const newText =  f.controls.newText.value ;
  
    this.mySub2 = this.profileSer.editPost(postId,newText).subscribe(resp=>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        document.getElementById(oldText.id).removeAttribute('hidden'); 
        document.getElementById(ff['id']).setAttribute('hidden','');
        this.post['text'] = newText ; 
        this.post['isEdited'] = true ;
    } 
       
    })

  }

  deletePost(ff){
    this.mySub3 = this.profileSer.deletePost(this.currentUserInfo.id,ff.id).subscribe(resp => {
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        this.post = null ;
      }
    })
  }


  addLike(postId){
    let currentUserId = this.currentUserInfo.id;
    let like = this.post?.likes.find(el => el.id == currentUserId) ;
    let likeId
    if(like) likeId = like._id ;
    let data = {
      adder : String(currentUserId) ,
      postOwner : this.post?.authorId._id ,
      likeId,
      postId 
    }
      if($('#btn_'+postId).hasClass('blue')) this.socketClient.emit('dislike' , data) ;
      else this.socketClient.emit('addLike' , data)
}


showComments(postId){
  document.getElementById(`comm_${postId}`).removeAttribute('hidden') ;
}


addComment(postId,comment){
  const userId = this.currentUserInfo.id ; 
  if(comment=='') alert("comment can't be nothing") 
  else {
    let data = {
      userId,
      postId ,
      comment,
      postOwner:this.post.authorId._id,
    }
    
    this.socketClient.emit('addComment',data)
  } 
}

showEditCommentBox(commentId){
  $(`#${commentId}`).attr('hidden' ,'') ;
  $(`#new${commentId}`).removeAttr('hidden')
}

editComment(commentId,postId, newComment) {   
  this.mySub4 = this.profileSer.editComment(commentId,postId,newComment).subscribe(resp => {
    if(resp && resp=='unexpected error') this.router.navigate(['/error'])
    if(resp['msg']) {
      let commentIndex = this.post.comments.findIndex(el => el._id == commentId ) ; 
      this.post.comments[commentIndex].text = newComment ; 
      $(`#new${commentId}`).attr('hidden' ,'') ;
      $(`#${commentId}`).removeAttr('hidden') ;
    }
  })
}

deleteComment(commentId,postId){
  let data = {
    commenterId : this.currentUserInfo.id ,
    commentId ,
    postId,
    postOwner : this.post.authorId._id ,
  }

  this.socketClient.emit('deleteComment' , data) ;
}


}
