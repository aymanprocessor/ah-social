import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import * as $ from 'jquery' ;
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit , OnDestroy {

  userPosts = [] ;
  profileUserId ;
  profileUserInfo ;
  visitorInfo = null ;
  storage = localStorage.getItem('token') ;
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  relation = null ; 
  chatId ; 
  response = false ; 
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  mySub3 : Subscription ;
  mySub4 : Subscription ;
  mySub5 : Subscription ;
	mySub6 : Subscription ;
  mySub7 : Subscription ;
  mySub8 : Subscription ;

  constructor(private profileSer:ProfileService , private rou:ActivatedRoute ,
     private router:Router , private store:Store , private title:Title ) {
       title.setTitle(`${jwt_decode(this.storage).name}`)
       this.store.subscribe(data =>{
         if(data['friendRequestsResponse']['name']=='addRequestSent') this.relation = 'sentReq' ;
         if(data['friendRequestsResponse']['name']=='addRequestRecieved') this.relation = 'recieveReq' ;
         if(data['friendRequestsResponse']['name']=='requestCanceledSuccessfully') this.relation = 'noRelation' ;
         if(data['friendRequestsResponse']['name']=='requestCanceled') this.relation = 'noRelation' ;
         if(data['friendRequestsResponse']['name']=='requestConfirmedS') this.relation = 'friends' ;
         if(data['friendRequestsResponse']['name']=='requestConfirmed') this.relation = 'friends' ;
         if(data['friendRequestsResponse']['name']=='requestRejectedS') this.relation = 'noRelation' ;
         if(data['friendRequestsResponse']['name']=='requestRejected') this.relation = 'noRelation' ;
         if(data['friendRequestsResponse']['name']=='removingDone') this.relation = 'noRelation' ;
         if(data['friendRequestsResponse']['name']=='youRemoved') this.relation = 'noRelation' ;
         if(data['notificationsReducer']['notificationType']=='likeAddedS') {
          let indexOfLikedPost = this.userPosts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
          if(!this.userPosts[indexOfLikedPost]?.likes.find(el => el._id == data['notificationsReducer']?.likeId)){
          this.userPosts[indexOfLikedPost]?.likes.push({
            _id : data['notificationsReducer']['likeId'],
            id:this.visitorInfo._id , 
            date:Date.now()
          })
         }
        }
         if(data['notificationsReducer']['notificationType']=='dislikedS') {
          let indexOfLikedPost = this.userPosts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
          let indexOfLiker = this.userPosts[indexOfLikedPost]?.likes.findIndex(el => el._id == data['notificationsReducer']['likeId']) ;
          this.userPosts[indexOfLikedPost]?.likes.splice(indexOfLiker,1) ;
         }
         if(data['notificationsReducer']['notificationType']=='commentAddedS') {     
          let postIndex =  this.userPosts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
          let comment = data['notificationsReducer']['comment'] ;
          if(!this.userPosts[postIndex].comments.find(el => el._id === data['notificationsReducer']?.comment?._id)){
          this.userPosts[postIndex]?.comments.push({
            _id : comment._id ,
            text:comment.text , 
            isEdited : comment.isEdited ,
            commenterId : {
              _id : this.visitorInfo._id , 
              name : this.visitorInfo.name , 
              image : this.visitorInfo.image
            }
          }) ;
         }
        }

         if(data['notificationsReducer']['notificationType']=='commentDeletedS') {
          let postIndex =  this.userPosts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
          let commentIndex = this.userPosts[postIndex]?.comments.findIndex(el => el._id == data['notificationsReducer']['commentId'] ) ; 
          this.userPosts[postIndex]?.comments.splice(commentIndex,1);
         }
       })

      
    
    
      
    
    rou.queryParamMap.subscribe(params =>{
      if(!params.get('id')) {
        if(this.storage) {
          this.profileUserId = jwt_decode(this.storage).id;
          this.router.navigate(['/profile'], { queryParams: { id: this.profileUserId } });
        }else {
          router.navigate(['/']) ;
        }
      }else {
        this.profileUserId = params.get('id');


    this.profileSer.getUserInfo(this.profileUserId).subscribe(data =>{
      if(data && data=='unexpected error') this.router.navigate(['/error'])
      if(data == 'err') router.navigate(['/404'])
      this.profileUserInfo = data ; 
      if(this.storage && data != 'err') {
        this.mySub1 = this.profileSer.getUserInfo(jwt_decode(this.storage).id).subscribe(data =>{
          if(data && data=='unexpected error') this.router.navigate(['/error'])
          //console.log(data)
          if(data == 'err') router.navigate(['/error'])
          this.visitorInfo = data ; 
          getRelation();
          //console.log(this.visitorInfo,this.profileUserInfo)
          this.mySub2 = profileSer.getChatId(this.visitorInfo?._id , this.profileUserInfo?._id).subscribe(chatId =>{
            if(chatId && chatId=='unexpected error') this.router.navigate(['/error'])
            if(chatId) this.chatId = chatId ;
          })
  
        })
      }
  

    }) ;

    

    this.mySub3 = profileSer.getUserPosts(this.profileUserId).subscribe(posts =>{
      if(posts && posts=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(posts)) {
        this.userPosts = posts ; 
        //console.log(posts)
      }
      else {
        this.router.navigate(['/404'])
      }
      this.response = true ;
    })

    
      }
    })



    let getRelation = ()=>{
      this.mySub4 = this.profileSer.getUserRequests(this.profileUserId).subscribe(resp=>{
        if(resp && resp=='unexpected error') this.router.navigate(['/error'])
        if(this.visitorInfo?._id == this.profileUserId) this.relation = 'isOwner';
        else if(resp['friends'].find(el => el.id == this.visitorInfo?._id ) && this.visitorInfo?._id != this.profileUserId) this.relation = 'friends';
        else if (resp['friendRequests'].find(el => String(el._id) == this.visitorInfo?._id )&& this.visitorInfo?._id != this.profileUserId) this.relation = 'sentReq';
        else if (resp['sentRequests'].find(el => String(el._id) == this.visitorInfo?._id)&& this.visitorInfo?._id != this.profileUserId) this.relation = 'recieveReq'; 
        else this.relation = 'noRelation'
        
      }) 
      
    }

    /*
    
    */
      

  }

  ngOnInit(): void {
    //console.log(this.visitorInfo , this.profileUserInfo)
    //console.log(this.visitorInfo , this.profileUserInfo)
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
    if(this.mySub5) this.mySub5.unsubscribe();
    if(this.mySub6) this.mySub6.unsubscribe();
    if(this.mySub7) this.mySub7.unsubscribe();
    if(this.mySub8) this.mySub8.unsubscribe();
  }

  checkLike(postId){
    const post = this.userPosts.find(el => el._id == postId) ;
    return post?.likes.find(el => el.id == this.visitorInfo?._id)
  }

  postImage
  postImageName

  selectImage(e){
    this.postImage =  e.target.files[0] ;
    this.postImageName = e.target.files[0].name ;
  }




  addNewPost(f:NgForm){
    const id = this.visitorInfo._id; 
    const text = f.controls.postText.value ;
    const imageFile = this.postImage ;
    this.mySub5 = this.profileSer.addNewPost({
      id ,
      text , 
    },imageFile).subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        f.reset();
        this.userPosts.unshift(resp['newPost'])
      }
    })
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
  
    this.mySub6 = this.profileSer.editPost(postId,newText).subscribe(resp=>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        document.getElementById(oldText.id).removeAttribute('hidden'); 
        document.getElementById(ff['id']).setAttribute('hidden','');
        let indexOfPostEditted = this.userPosts.findIndex(el => el._id == postId) ;
        this.userPosts[indexOfPostEditted]['text'] = newText ; 
        this.userPosts[indexOfPostEditted]['isEdited'] = true ;
    } 
       
    })

  }

  deletePost(ff){
    this.mySub7 = this.profileSer.deletePost(this.visitorInfo._id,ff.id).subscribe(resp => {
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        let index = this.userPosts.findIndex(el => el._id == ff.id) ;
        this.userPosts.splice(index,1) ; 
      }
    })
  }


  addLike(postId){
    let currentUserId = this.visitorInfo._id;
    let indexOfLikedPost = this.userPosts.findIndex(el => el._id == postId) ;
    let like = this.userPosts[indexOfLikedPost]?.likes.find(el => el.id == currentUserId) ;
    let likeId
    if(like) likeId = like._id ;
    let data = {
      adder : String(currentUserId) ,
      postOwner : String(this.profileUserId) ,
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
  const userId = this.visitorInfo._id ; 
  if(comment=='') alert("comment can't be nothing") 
  else {
    let data = {
      userId,
      postId ,
      comment,
      postOwner:this.profileUserId,
    }
    this.socketClient.emit('addComment',data)
  } 
}

showEditCommentBox(commentId){
  $(`#${commentId}`).attr('hidden' ,'') ;
  $(`#new${commentId}`).removeAttr('hidden')
}

editComment(commentId,postId, newComment) {   
  this.mySub8 = this.profileSer.editComment(commentId,postId,newComment).subscribe(resp => {
    if(resp && resp=='unexpected error') this.router.navigate(['/error'])
    if(resp['msg']) {
      let postIndex =  this.userPosts.findIndex(el => el._id == postId) ;
      let commentIndex = this.userPosts[postIndex].comments.findIndex(el => el._id == commentId ) ; 
      this.userPosts[postIndex].comments[commentIndex].text = newComment ; 
      $(`#new${commentId}`).attr('hidden' ,'') ;
      $(`#${commentId}`).removeAttr('hidden') ;
    }
  })
}

deleteComment(commentId,postId){
  let data = {
    commenterId : this.visitorInfo._id ,
    commentId ,
    postId,
    postOwner : this.profileUserId ,
  }

  this.socketClient.emit('deleteComment' , data) ;
}




addFriend(){
  let data = {
    sender : this.visitorInfo , 
    reciever : this.profileUserInfo , 
  }
  this.socketClient.emit('addFriend' , data) ; 
}

cancelRequest(){
  let data = {
    sender : this.visitorInfo , 
    reciever : this.profileUserInfo , 
  }
  this.socketClient.emit('cancelRequest' , data ) ; 
}

confirmRequest(){
  let data = {
    reciever : this.visitorInfo , 
    sender : this.profileUserInfo , 
  }
  this.socketClient.emit('confirmRequest' , data ) ; 
}
  
rejectRequest(){
  let data = {
    reciever : this.visitorInfo , 
    sender : this.profileUserInfo , 
  }
  this.socketClient.emit('rejectRequest' , data ) ; 
}

removeFriend(){
  let data = {
    remover : this.visitorInfo._id , 
    removed : this.profileUserInfo._id , 
  }
  this.socketClient.emit('removeFriend' , data ) ; 
}
  

  
}





