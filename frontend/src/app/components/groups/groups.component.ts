import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from './../../services/chats.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import * as io from 'socket.io-client' ;
import { Store } from '@ngrx/store';
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit , OnDestroy {

  currentUserInfo = jwt_decode(localStorage.getItem('token'))
  userFriends  = [] ;
  recieverInfo ; 
  chatMessages = [] ; 
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  chatId ;
  isAuthorized = false ; 
  userGroups = [] ; 
  response = false ;
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  mySub3 : Subscription ;

  constructor(private friendsSer:FriendsService , private chatSer:ChatsService,
    private rou:ActivatedRoute , private store:Store , private router:Router , private title:Title ){
      title.setTitle('groups')
    rou.queryParamMap.subscribe(param =>{
      
      let id = param.get('id') ;
      this.chatId = id ; 
      let data = {
        userId : this.currentUserInfo.id , 
        groupId : id 
      }
      if(id){
        //console.log(id)
        this.mySub1 = this.chatSer.joinGroup(data).subscribe(resp =>{
          if(resp && resp=='unexpected error') this.router.navigate(['/error'])
          if(!resp) router.navigate(['/404']) ;
          if(resp){
            this.mySub2 = chatSer.getChat(id).subscribe(chat =>{
              if(chat && chat=='unexpected error') this.router.navigate(['/error'])
              this.response = true ;
              if(chat == 'err') router.navigate(['/404']) ;
              else{
                this.chatMessages =  chat['messages'] ;
              setTimeout(() => {
                $(window).scrollTop(9999999)
              }, 50);
              }
            })
          }
        })
      }else {
        this.mySub3 = chatSer.getUserGroups(this.currentUserInfo.id).subscribe(resp =>{
          if(resp && resp=='unexpected error') this.router.navigate(['/error'])
          this.response = true ;
          this.userGroups = resp['groups'] ;
        })
      }
      
    })

    
    store.subscribe(data =>{
      if(data['groupChatReducer']['newMsg']){
        //console.log(data['groupChatReducer']['newMsg'])
        if(!this.chatMessages.find(el => el._id == data['groupChatReducer']['newMsg']._id )){
          this.chatMessages.push(data['groupChatReducer']['newMsg'])
        }
        }
        //console.log(data['groupChatReducer']['newMsg'])
    })

    


    
    
    
  }

  ngOnInit(): void {
    /*
    let chatId = this.chatId ; 
    setTimeout(() => {
      $.when($.ready).then(function(){
        if(chatId) $(window).scrollTop(9999999)
        //console.log(chatId)
      })
    }, 200);
    */
  }  

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
    if(this.mySub3) this.mySub3.unsubscribe();
  }

  
  sendMsg(f:NgForm){
    let newMessage = f.controls.newMessage.value ; 
    let data = {
      chatId : this.chatId, 
      senderId : this.currentUserInfo.id , 
      content : newMessage  ,
    }

    this.socketClient.emit('newGroupMsg',data) ;
    f.reset()
  }


  showCreateG(){
    $('#createG').removeAttr('hidden');
  }
}