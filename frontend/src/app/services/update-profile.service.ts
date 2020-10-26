import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {

  constructor(private httpC:HttpClient) { }

  //token = localStorage.getItem('token')


  editInfo(data,pImage,cImage){
    //let headers = new HttpHeaders();
    let formData = new FormData(); 
    formData.append('data' , JSON.stringify(data)) ;
    if(cImage) formData.append('cImage',cImage) ;
    if(pImage) formData.append('pImage',pImage) ;
    return this.httpC.post('api/editInfo' , formData)
  }
}
