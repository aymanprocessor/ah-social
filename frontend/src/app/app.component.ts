import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ah-social';
  socketClient = io();
  //socketClient = io('http://localhost:3000');
  isUser ; 
  onlineFriends = []
  constructor(private store:Store){



     let currentUserInfo ; 
     if(localStorage.getItem('token')) currentUserInfo = jwt_decode(localStorage.getItem('token'))
    this.socketClient.on('connect' , ()=>{
      if(currentUserInfo && currentUserInfo.id){
        this.socketClient.emit('createUserRoom',currentUserInfo.id )
        this.socketClient.emit('activeNow',currentUserInfo)
        this.socketClient.emit('getOnlineFriends',currentUserInfo.id);
      } 
    })

    this.socketClient.on('onlineFriends',onlineFriends =>{
      this.store.dispatch({type:'onlineFriends' , payload:onlineFriends})
    })

    this.socketClient.on('friendGotOnline',friendData =>{
      this.store.dispatch({type:'friendGotOnline' , payload:friendData})
    })

    this.socketClient.on('friendGotOffline',friendData =>{
      this.store.dispatch({type:'friendGotOffline' , payload:friendData})
    })

    

    
      this.socketClient.on('addRequestSent' , data =>{
        this.store.dispatch({type:'addRequestSent'})
      })
      
      this.socketClient.on('addRequestRecieved' , data =>{
        this.store.dispatch({type:'add',payload:data.sender})
        this.store.dispatch({type:'addRequestRecieved'})
      })
      
      this.socketClient.on('requestCanceled' , data =>{
        this.store.dispatch({type:'cancel',payload:data.sender})
        this.store.dispatch({type:'requestCanceled'})
      })
      
      this.socketClient.on('requestCanceledSuccessfully' , () =>{
        this.store.dispatch({type:'requestCanceledSuccessfully'})
      })

      
      this.socketClient.on('requestConfirmed' , ()=>{
        this.store.dispatch({type:'requestConfirmed'})
      })

      this.socketClient.on('requestConfirmedS' , ()=>{
        this.store.dispatch({type:'requestConfirmedS'})
      })

      this.socketClient.on('requestRejected' , ()=>{
        this.store.dispatch({type:'requestRejected'})
      })

      this.socketClient.on('requestRejectedS' , ()=>{
        this.store.dispatch({type:'requestRejectedS'})
      })

      this.socketClient.on('removingDone' , ()=>{
        this.store.dispatch({type:'removingDone'})
      })

      this.socketClient.on('youRemoved' , ()=>{
        this.store.dispatch({type:'youRemoved'})
      })

      this.socketClient.on('likeAddedS' , data =>{
        store.dispatch({type:'likeAddedS' , payload:data});
      })

      this.socketClient.on('likeAdded' , data =>{
        store.dispatch({type:'likeAdded' , payload:data});
      })

      this.socketClient.on('dislikedS' , data =>{
        store.dispatch({type:'dislikedS' , payload:data});
      })

      this.socketClient.on('disliked' , data =>{
        store.dispatch({type:'disliked' , payload:data});
      })

      this.socketClient.on('commentAddedS' , data =>{
        store.dispatch({type:'commentAddedS' , payload:data});
      })

      this.socketClient.on('commentAdded' , data =>{
        store.dispatch({type:'commentAdded' , payload:data});
      })

      this.socketClient.on('commentDeletedS' , data =>{
        store.dispatch({type:'commentDeletedS' , payload:data});
      })

      this.socketClient.on('commentDeleted' , data =>{
        store.dispatch({type:'commentDeleted' , payload:data});
      })

    this.socketClient.on('msgSent',msg =>{
      //console.log(msg)
      this.store.dispatch({type:'newMsg' , payload:msg})
    })

    this.socketClient.on('msgRecieved',msg =>{
      this.store.dispatch({type:'newMsg' , payload:msg})
    })

    this.socketClient.on('joinedGroupS',() =>{
      this.store.dispatch({type:'joinGroup'})
    })

    this.socketClient.on('newGbMsg',newMessage =>{
      //console.log(newMessage)
      this.store.dispatch({type:'newGbMsg' , payload:newMessage})
      this.store.dispatch({type:'newMsg' , payload:newMessage})

    })
  }


  ngOnInit(){
    

  }

}
