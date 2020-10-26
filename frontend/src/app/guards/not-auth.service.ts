import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotAuthService implements CanActivate {

  constructor(private httpC:HttpClient , private router : Router , private store : Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean | Observable<boolean> | Promise<boolean>{
    return new Promise(resolve => {

      if(!localStorage.getItem('token')) resolve (true)
      else {
            let headers = new HttpHeaders().set('token' , localStorage.getItem('token')) ;
           this.httpC.get('api' , {headers} )
          .subscribe(response => {
            if(response['isAuthorized'] == false) {
              localStorage.clear();
              this.store.dispatch({type : 'notUser'} )
              resolve(true)
            }
            else  this.router.navigate(['/'])
        }) 
      }
             
    })
      
  }
}


