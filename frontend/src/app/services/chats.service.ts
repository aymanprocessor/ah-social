import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  token = localStorage.getItem('token') ;
  constructor(private httpC:HttpClient) {}

  getChat(chatId){
    let headers = new HttpHeaders().set('chatId' , chatId ); 
    return this.httpC.get('api/chat',{headers}) ;
  }

  getAllChats(userId){
    let headers = new HttpHeaders().set('userId' , userId); 
    return this.httpC.get('api/allChats',{headers}) ;
  }

  sendMsg(data){
    return this.httpC.post('api/newMsg',{data}) ;
  }

  createGroup(data){
    return this.httpC.post('api/createGroup',{data}) ;
  }

  joinGroup(data){
    return this.httpC.post('api/joinGroup',{data}) ;
  }

  getUserGroups(userId){
    let headers = new HttpHeaders().set('userId' , userId)
    return this.httpC.get('api/groups',{headers}) ;
  }

}
