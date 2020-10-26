import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = localStorage.getItem('token') ;
  headers = new HttpHeaders().set('token',this.token);

  

  constructor(private httpC:HttpClient) {}


  creatAccount(data){
    return this.httpC.post('api/register' , data ) ;
  }

  login(data){
    return this.httpC.post('api/login' , data) ;
  }


}
