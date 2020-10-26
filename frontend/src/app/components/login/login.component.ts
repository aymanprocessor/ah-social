import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy {

  socketClient = io();
  //socketClient = io('http://localhost:3000');
  mySub1 : Subscription ;
  response ;
  constructor(private authSer:AuthService , private router:Router , private store:Store , private title:Title){
    title.setTitle('login')
  }

  ngOnInit(): void {
    let height = $(window).height();
    $('#main').height(height);
  }
  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
  }

  msgSuccess ; 
  msgFailed ;
  onSubmit(f){
    this.response = false ;
    //console.log('here')
    const fields = f.controls ; 
    this.mySub1 = this.authSer.login({
      email:fields.email.value , 
      password:fields.password.value , 
    }).subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      this.response = true ;
      if(resp['success']== true) {
        this.msgSuccess = resp['msg'] ;
        let userInfo = jwt_decode(resp['token']) ;
        localStorage.setItem('token',resp['token']); 
        this.store.dispatch({type:'isUser',payload:{}}) ; 
        //console.log(userInfo)
        this.socketClient.emit('createUserRoom',userInfo )
        this.socketClient.emit('getOnlineFriends' ,userInfo.id)
        this.socketClient.emit('activeNow' ,userInfo)
        setTimeout(()=>{
          this.router.navigate(['/']) ;
        },1500)
      }  
      else this.msgFailed = resp['msg'] ;
      setTimeout(()=>{
        f.reset();
        this.msgSuccess = null ; 
        this.msgFailed = null ;
      },2000)
    }) 
  }

}
