import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { ProfileService } from 'src/app/services/profile.service';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit , OnDestroy {

  friendRequests = []
  usInfo = jwt_decode(localStorage.getItem('token'))
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  response = false ; 
  mySub1 : Subscription ;

  constructor(private navbarSer:NavbarService,private profileSer:ProfileService ,
     private title:Title , private router:Router){
    title.setTitle('friend-requests') ;
    this.mySub1 = navbarSer.getFriendRequests(this.usInfo?.id).subscribe(friendRequests =>{
      if(friendRequests && friendRequests=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(friendRequests)) this.friendRequests = friendRequests ; 
      this.response = true
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
  }

  requestAction(type,senderInfo){
    this.usInfo._id = this.usInfo.id
    let data = {
      reciever : this.usInfo , 
      sender : senderInfo
    }
    if(type == 'confirm') this.socketClient.emit('confirmRequest' , data) ;
    else if(type == 'reject') this.socketClient.emit('rejectRequest' , data) ;
    let index = this.friendRequests.findIndex(el => el._id == senderInfo._id) ; 
    this.friendRequests.splice(index,1);
  }

  
}
