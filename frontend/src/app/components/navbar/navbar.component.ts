import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarService } from 'src/app/services/navbar.service';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isUser ;
  userInfo
  friendRequests = []
  socketClient = io();
  //socketClient = io('http://localhost:3000/');
  usId ;
  notifications = [] ; 
  unviewedNotifications = 0;
  newMessages = []
  unseenMessages = 0 ;
  iamSender = false

  constructor(private router:Router , private store:Store , private navbarSer:NavbarService) {
    
    this.store.subscribe(data =>{
      if(data['userStateReducer']['isUser'] == true ){
      }
      
      this.isUser = data['userStateReducer']['isUser'];
      if(this.isUser) {
        this.usId = jwt_decode(localStorage.getItem('token')).id ;
      }
      if(!this.isUser && this.usId) this.socketClient.emit('customDisconnect' , this.usId );
      if(data['friendRequestsReducer'].type=='add'){
        let found = this.friendRequests.find(el => el._id == data['friendRequestsReducer']['requestData']._id )
        if(!found){
          this.friendRequests.push(data['friendRequestsReducer']['requestData']);
          $('#ico2').addClass('red') 
        }
        

        
      } 
      if(data['friendRequestsReducer'].type=='cancel') {
        let index = this.friendRequests.findIndex(el => el._id == data['friendRequestsReducer']['requestData']?._id ) ;
        this.friendRequests.splice(index,1)
        $('#ico2').removeClass('red') 

      }
      if(data['notificationsReducer']['notificationType']=='likeAdded') {
        this.notifications.unshift(data['notificationsReducer']['newNotification']) ;  
        $('#ico1').addClass('red') ;
      }
      if(data['notificationsReducer']['notificationType']=='disliked') {
        let index = this.notifications.findIndex(el => el.likeId == data ['notificationsReducer']['likeId']);
        this.notifications.splice(index,1);
        $('#ico1').removeClass('red') ;
      }
      if(data['notificationsReducer']['notificationType']=='commentAdded') {
        this.notifications.unshift(data['notificationsReducer']['newNotification']) ;  
        $('#ico1').addClass('red') ;

      }
      if(data['notificationsReducer']['notificationType']=='commentDeleted') {
        let index = this.notifications.findIndex(el => el.commentId == data ['notificationsReducer']['commentId']);
        this.notifications.splice(index,1);
        $('#ico1').removeClass('red') ;
      }
      if(data['chatReducer']['newMessage']) {
        //console.log(data['chatReducer']['newMessage'])
        if(data['chatReducer']['newMessage']?.senderId._id == this.usId ) this.iamSender = true 
        else this.iamSender = false ; 
        let index = this.newMessages.findIndex(el => el.senderId._id == data['chatReducer']['newMessage']?.senderId._id)
        if(data['chatReducer']['newMessage'].senderId._id != this.usId){
          if(index != -1){
            this.newMessages = JSON.parse(JSON.stringify(this.newMessages))
            this.newMessages[index].content = data['chatReducer']['newMessage']?.content ;
           }else {
            this.newMessages.push(data['chatReducer']['newMessage'])
           }     
           $('#ico3').addClass('red') ;

        }      
      }

    })

    if(this.usId) {
      //console.log(this.usId)
      navbarSer.getFriendRequests(this.usId).subscribe(resp=>{
        if(resp && resp=='unexpected error') this.router.navigate(['/error'])
        if(Array.isArray(resp)) this.friendRequests = resp ;
        if(resp !=0) $('#ico2').addClass('red') ;
      })

      navbarSer.getNotifications(this.usId).subscribe(notifications =>{
        if(notifications && notifications=='unexpected error') this.router.navigate(['/error'])
        let  unviewedNotifications  = 0 ;
        if(Array.isArray(notifications)) this.notifications = notifications ;
        for(let i=0 ; i<notifications['length'];i++){
          if(notifications[i].isViewed == false) unviewedNotifications++ ;
        }
        if(unviewedNotifications !=0) $('#ico1').addClass('red') ;

      })
      
    }



  

    

    

    
    $.when( $.ready ).then(function() {
      
    })
    
    
  }

  ngOnInit(): void {

    
  }


  navigate(link,hidden,icon){
    $(`#${icon}`).removeClass('red')
    if($(window).innerWidth() <= 768){
      $(`#${hidden}`).hide();
      this.router.navigate([`/${link}`])
      //$(`#${icon}`).removeClass('red')
    }
  }
  
  
  logout(){
    let user = jwt_decode(localStorage.getItem('token')) 
    if(user){
      this.socketClient.emit('customDisconnect',user)
      localStorage.removeItem('token') ;
      this.store.dispatch({type:'notUser',payload:{}}) ;
      this.router.navigate(['/login']);
    }
  }

  notificationViewed(id){
    this.navbarSer.editNotificationState(this.usId,id).subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        let notificationIndex = this.notifications.findIndex(el => el._id == id) ;
        this.notifications = JSON.parse(JSON.stringify(this.notifications)) // because readOnly problem
        this.notifications[notificationIndex]['isViewed'] = true ;
      }
    })
  }
  
}
