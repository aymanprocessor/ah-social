import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  onlineFriends = []
  constructor(private store:Store , private title:Title) {
    title.setTitle('online-friends')
    store.subscribe(data =>{
      if(data['onlineStateReducer']['onlineFriends']) {
        this.onlineFriends = data['onlineStateReducer']['onlineFriends'] ;
        //console.log(this.onlineFriends)

       }
       if(data['onlineStateReducer']?.newOnlineFriend) {
        this.onlineFriends = JSON.parse(JSON.stringify(this.onlineFriends)) // because readOnly problem
        if(!this.onlineFriends.find(el => el._id == data['onlineStateReducer']['newOnlineFriend']._id )){
          this.onlineFriends.push(data['onlineStateReducer']['newOnlineFriend']) ;
          //console.log(this.onlineFriends)

        }
       }
       if(data['onlineStateReducer']?.newOfflineFriend) {
        this.onlineFriends = JSON.parse(JSON.stringify(this.onlineFriends)) // because readOnly problem
        let index = this.onlineFriends.findIndex(el => el._id == data['onlineStateReducer']['newOfflineFriend'])
        this.onlineFriends.splice(index,1) ;
        //console.log(this.onlineFriends)

       }
    })
  }

  ngOnInit(): void {
  }

}
