import { async } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {


  
  constructor(private httpC:HttpClient) {}
 

  getFriendRequests(userId){
    let token  = localStorage.getItem('token') ;
    let headers = new HttpHeaders().set('userId', userId).set('token',token) ;
    return this.httpC.get('api/friends/requests' , {headers}) ;
  }

  getSentRequests(userId){
    let token  = localStorage.getItem('token') ;
    let headers = new HttpHeaders().set('userId', userId).set('token',token) ;
    return this.httpC.get('api/friends/sentRequests' , {headers}) ;
    
  }

  getNotifications(userId){
    let token  = localStorage.getItem('token') ;
    let headers = new HttpHeaders().set('userId', userId).set('token',token);
    return this.httpC.get('api/friends/notifications' , {headers}) ;    
  }

  editNotificationState(userId,id){
    let token  = localStorage.getItem('token') ;
    let headers = new HttpHeaders().set('token',token);
    return this.httpC.post('api/friends/editNotifications' , {userId,id} ,{headers}) ;
    
  }


  getUserInfo(id){
    //let token  = localStorage.getItem('token') ;
    let headers = new HttpHeaders().set('id',id)
    return this.httpC.get('api/info' ,{headers}) ;
  }

  


}
