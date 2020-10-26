import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NavbarService } from './../../services/navbar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent implements OnInit , OnDestroy {

  allUsers = [] ; 
  friends = [] ; 
  friendRequsets = []
  sentRequsets = []
  searchedArray = []
  socketClient = io();
	//socketClient = io('http://localhost:3000');
  response ; 
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  mySub3 : Subscription ;
  mySub4 : Subscription ;


  currentUserInfo = jwt_decode(localStorage.getItem('token'))  
  constructor(private friendsSer:FriendsService , private navBarSer:NavbarService ,
     private title:Title , private router:Router){
    title.setTitle('find-friends')

    this.mySub1 = this.friendsSer.getAllUsers().subscribe(users =>{
      if(users && users=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(users)){
        let index = users.findIndex(el => el._id == this.currentUserInfo.id) ;
        users.splice(index,1) ; 
        this.allUsers = users  ;  
      }
    })

    this.mySub2 = this.friendsSer.getUserFriends().subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      this.friends = resp['friends']  ; 
    })

    this.mySub3 = this.navBarSer.getFriendRequests(this.currentUserInfo.id).subscribe(fRequests =>{
      if(fRequests && fRequests=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(fRequests)) this.friendRequsets = fRequests  ; 
      //console.log(this.friendRequsets)
    })

    this.mySub4 = this.navBarSer.getSentRequests(this.currentUserInfo.id).subscribe(sRequests =>{
      if(sRequests && sRequests=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(sRequests)) this.sentRequsets = sRequests  ; 
      //console.log(this.friendRequsets)
    })

    
    
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
    if(this.mySub3) this.mySub3.unsubscribe();
    if(this.mySub4) this.mySub4.unsubscribe();
  }

  search(inp){
    this.response = true
    this.searchedArray = []
    if(inp != ''){
      for(let user of this.allUsers){
        if(user.name.includes(inp) && !this.searchedArray.includes(user)) this.searchedArray.push(user)
      }
    }else this.searchedArray = []
    this.response = false ; 
  }

  checkFriend(id){
    return this.friends.find(el => el?.id._id == id)
  }

  checkRequest(id){
    return this.friendRequsets.find(el => el._id == id) ; 
  }

  checkSent(id){
    return this.sentRequsets.find(el => el._id == id) ; 
  }

  getChatId(id){
     let friend =  this.friends.find(el => el?.id._id == id)
     if(friend) return friend.chatId ;
  }

  action(id,type){
    //console.log(id)
    this.currentUserInfo._id = this.currentUserInfo.id
    let data = {
      sender : this.currentUserInfo , 
      reciever : this.allUsers.find(el => el?._id == id) , 
    }

    
    if(type == 'add'){
      //console.log('here')
      //console.log(data)
      this.socketClient.emit('addFriend' , data) ; 
      $(`#addBtn_${id}`).attr('hidden' , '') ; 
      $(`#cancelBtn_${id}`).removeAttr('hidden') ;
    }else if(type == 'cancel'){
      //console.log('here2')
      this.socketClient.emit('cancelRequest' , data) ; 
      $(`#cancelBtn_${id}`).attr('hidden' , '') ; 
      $(`#addBtn_${id}`).removeAttr('hidden') ;
    }

     
  }


}
