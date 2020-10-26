import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  token = localStorage.getItem('token') ;

  constructor(private httpC:HttpClient) {}

  getAllOfCurrent(id){
    let headers = new HttpHeaders().set('id',id) ;
    return this.httpC.get('api/allOfCurrent' , {headers}) ;
  }
}
