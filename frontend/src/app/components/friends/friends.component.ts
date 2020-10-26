import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendsService } from 'src/app/services/friends.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit , OnDestroy {

  friends : [] ; 
  response = false ;
  mySub1 : Subscription ;

  constructor(private friendsSer:FriendsService , private title:Title , private router:Router){
    title.setTitle('friends');
    this.mySub1 = friendsSer.getUserFriends().subscribe(resp => {
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      this.friends =  resp['friends']
      this.response = true
    })

  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
  }

}
