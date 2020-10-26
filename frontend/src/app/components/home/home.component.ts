import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import {Component, OnDestroy, OnInit } from '@angular/core';
import * as $ from 'jquery' ;
import { HomeService } from 'src/app/services/home.service';
import { ProfileService } from 'src/app/services/profile.service';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {slideInLeftOnEnterAnimation } from 'angular-animations';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] , 
  animations : [slideInLeftOnEnterAnimation()] ,
  host: {
    '(window:resize)': 'onResize($event)'
  } , 
})
export class HomeComponent implements OnInit , OnDestroy {

  onResize(event){
    //console.log(22)
    //event.target.innerWidth; // window width
    setTimeout(() => {
      if($(window).innerWidth() >= 768 )  $('.space').removeAttr('hidden')
      else $('.space').attr('hidden','')
    }, 10);
  }

  posts = [] ;
  currentUserInfo ;
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  onlineFriends = [] ; 
  response = false ; 
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  mySub3 : Subscription ;
  mySub4 : Subscription ;


  constructor(private homeSer:HomeService,private profileSer:ProfileService,private store:Store ,
    private router:Router , private title:Title){
      title.setTitle('ah-social')
    let userInfo = jwt_decode(localStorage.getItem('token')) ;
    if(userInfo){
      this.mySub1 = homeSer.getAllOfCurrent(userInfo.id).subscribe(resp =>{
        if(resp && resp=='unexpected error') this.router.navigate(['/error'])
        this.currentUserInfo = resp;
        for(let i=0 ; i<resp['friends']?.length;i++){
          for(let y=0 ;y<resp['friends'][i].id.posts.length;y++){
            this.posts.unshift(resp['friends'][i].id.posts[y])
          }
        }
        this.response = true
      })
    }

    store.subscribe(data =>{
      if(data['userStateReducer']['isUser'] == false) this.currentUserInfo = null ; 

      if(data['notificationsReducer']['notificationType']=='likeAddedS') {
        let indexOfLikedPost = this.posts.findIndex(el => el._id == data['notificationsReducer']?.postId) ;
        if(!this.posts[indexOfLikedPost].likes.find(el => el._id == data['notificationsReducer']?.likeId)){
          this.posts[indexOfLikedPost]?.likes.push({
            _id : data['notificationsReducer']?.likeId,
            id: this.currentUserInfo ,
            date:Date.now()
          })
        }
        

       }
       if(data['notificationsReducer']['notificationType']=='dislikedS') {
        let indexOfLikedPost = this.posts.findIndex(el => el._id == data['notificationsReducer']?.postId) ;
          let indexOfLiker = this.posts[indexOfLikedPost]?.likes.findIndex(el => el._id == data['notificationsReducer']?.likeId) ;
          this.posts[indexOfLikedPost]?.likes.splice(indexOfLiker,1) ;
       }
       if(data['notificationsReducer']['notificationType']=='commentAddedS') {   
        let postIndex =  this.posts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
        let comment = data['notificationsReducer']?.comment ;
        if(!this.posts[postIndex]?.comments.find(el => el._id === data['notificationsReducer']?.comment?._id)){
          this.posts[postIndex]?.comments.push({
            _id : comment._id ,
            text:comment.text , 
            isEdited : comment.isEdited ,
            commenterId : {
              _id : this.currentUserInfo?._id , 
              name : this.currentUserInfo.name , 
              image : this.currentUserInfo.image
            }
          }) ;
        }
       }
       if(data['notificationsReducer']['notificationType']=='commentDeletedS') {
        let postIndex =  this.posts.findIndex(el => el._id == data['notificationsReducer']['postId']) ;
        let commentIndex = this.posts[postIndex]?.comments.findIndex(el => el._id == data['notificationsReducer']['commentId'] ) ; 
        this.posts[postIndex]?.comments.splice(commentIndex,1);
       }

       if(data['onlineStateReducer']['onlineFriends']) {
        this.onlineFriends = data['onlineStateReducer']['onlineFriends'] ;

       }
       if(data['onlineStateReducer']?.newOnlineFriend) {
        this.onlineFriends = JSON.parse(JSON.stringify(this.onlineFriends)) // because readOnly problem
        if(!this.onlineFriends.find(el => el._id == data['onlineStateReducer']['newOnlineFriend']._id )){
          this.onlineFriends.push(data['onlineStateReducer']['newOnlineFriend']) ;
        }
       }
       if(data['onlineStateReducer']?.newOfflineFriend) {
        this.onlineFriends = JSON.parse(JSON.stringify(this.onlineFriends)) // because readOnly problem
        let index = this.onlineFriends.findIndex(el => el._id == data['onlineStateReducer']['newOfflineFriend'])
        this.onlineFriends.splice(index,1) ;
       }

    })


  }

  ngOnInit(): void {
     
    $.when( $.ready ).then(function() {
      //console.log($('#sideMenu').height() , $(window).height() )
      $('.likeBtn').on('click' , function(){
        $(this).toggleClass('blue')
      })
      $('#sideMenu').css({
        height : $(window).height()
      })
      $('#online').css({
        height : $(window).height()
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
    const post = this.posts.find(el => el._id == postId) ;
    return (post.likes?.find(el => el.id._id == this.currentUserInfo?._id))
  }

  checkWindow(){
    return ($(window).innerWidth() >= 768 ) 
  }


  navigateTo(to){
    console.log(22)
    this.router.navigate([`/${to}`])
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
        let indexOfPostEditted = this.posts.findIndex(el => el._id == postId) ;
        this.posts[indexOfPostEditted]['text'] = newText ; 
        this.posts[indexOfPostEditted]['isEdited'] = true ;
    } 
       
    })

  }

  deletePost(ff){
    this.mySub3 = this.profileSer.deletePost(this.currentUserInfo._id,ff.id).subscribe(resp => {
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        let index = this.posts.findIndex(el => el._id == ff.id) ;
        this.posts.splice(index,1) ; 
      }
    })
  }


  addLike(ownerId,postId){
    let currentUserId = this.currentUserInfo._id;
    let indexOfLikedPost = this.posts.findIndex(el => el._id == postId) ;
    let like = this.posts[indexOfLikedPost]?.likes.find(el => el.id._id == currentUserId) ;
    let data = {
      adder : currentUserId ,
      postOwner : ownerId  ,
      likeId : null,
      postId 
    }
    
    if(like) {
      data.likeId = like._id ;
      this.socketClient.emit('dislike' , data)
    }else this.socketClient.emit('addLike' , data) ;
    
    
     
}


showComments(postId){
  document.getElementById(`comm_${postId}`).removeAttribute('hidden') ;
}


addComment(postId,comment,postOwner){
  const userId = this.currentUserInfo._id ; 
  if(comment=='') alert("comment can't be nothing") 
  else {
    let data = {
      userId,
      postId ,
      comment,
      postOwner,
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
      let postIndex =  this.posts.findIndex(el => el._id == postId) ;
      let commentIndex = this.posts[postIndex].comments.findIndex(el => el._id == commentId ) ; 
      this.posts[postIndex].comments[commentIndex].text = newComment ; 
      $(`#new${commentId}`).attr('hidden' ,'') ;
      $(`#${commentId}`).removeAttr('hidden') ;
    }
  })
}

deleteComment(commentId,postId,postOwner){
  let data = {
    commenterId : this.currentUserInfo._id ,
    commentId ,
    postId,
    postOwner ,
  }

  this.socketClient.emit('deleteComment' , data) ;
}

}
