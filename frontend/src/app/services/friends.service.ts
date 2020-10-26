import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  token = localStorage.getItem('token');
  constructor(private httpC:HttpClient) {}

  getUserFriends(){
    let headers = new HttpHeaders().set('userId' , jwt_decode(this.token).id)
    return this.httpC.get('api/friends' , {headers})
  }

  getAllUsers(){
    return this.httpC.get('api/users')
  }
}
