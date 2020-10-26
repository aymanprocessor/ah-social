import { ChatsService } from './../../services/chats.service';
import { Router } from '@angular/router';
import { FriendsService } from './../../services/friends.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwt_decode from "jwt-decode";
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit , OnDestroy {

  userFriends ; 
  currentUserInfo =  jwt_decode(localStorage.getItem('token')) ;
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  constructor(private friendsSer:FriendsService , private router:Router, private chatSer:ChatsService,private title:Title){
    title.setTitle('create-group')
    //console.log(222)
    this.mySub1 = friendsSer.getUserFriends().subscribe(resp =>{
      if(resp && resp=='unexpected error') router.navigate(['/error'])
      //console.log(resp)
      if(Array.isArray(resp['friends'])) this.userFriends = resp['friends']  ; 
    })
    
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
  }


  createGroup(gName,friends:HTMLBodyElement){
    let members = [this.currentUserInfo.id] ;
    for(let i=0 ; i<friends.children.length ; i++) {
      for(let y=0 ; y<friends.children[i].children.length;y++){
        if(friends.children[i].children[y]['checked']) {
          members.push(friends.children[i].children[y]['id'])
        }
      }
    }

    let data = {
      name : gName , 
      members
    }

    if(data.members.length > 2 && data.name != ''){
      this.mySub2 = this.chatSer.createGroup(data).subscribe(resp =>{
        if(resp && resp=='unexpected error') this.router.navigate(['/error'])
        if(resp == 'created') this.router.navigate(['/groups'])
      })
    }else alert('name and members required')
    
  }

}
