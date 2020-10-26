import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UpdateProfileService } from './../../services/update-profile.service';
import { NgForm } from '@angular/forms';
import { NavbarService } from './../../services/navbar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwt_decode from "jwt-decode";
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit , OnDestroy {

  currentUserInfo = jwt_decode(localStorage.getItem('token'))
  userInfo ; 
  response ; 
  mySub1 : Subscription ;
	mySub2 : Subscription ;

  constructor(private navSer:NavbarService , private updateSer:UpdateProfileService,
    private router:Router , private title:Title , private store:Store) {
      title.setTitle('update-profile')
    if(this.currentUserInfo && this.currentUserInfo.id){
      this.mySub1 = navSer.getUserInfo(this.currentUserInfo.id).subscribe(userInfo=>{
        if(userInfo && userInfo=='unexpected error') this.router.navigate(['/error'])
        //console.log(userInfo)
        if(userInfo) this.userInfo = userInfo ;
      })
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
  }

  pImage 
  pImageName
  cImage
  cImageName

  selectImage(e){
    this.pImage =  e.target.files[0] ;
    //console.log(this.pImage)
    this.pImageName = e.target.files[0].name ;

  }
  selectImage2(e){
    this.cImage =  e.target.files[0] ;
    this.cImageName = e.target.files[0].name ;
  }

  
  save(f:NgForm){
    this.response = false ;
    let data = {
      id : this.userInfo._id ,
      name : f.controls.name.value , 
      address : f.controls.address.value ,
      email : f.controls.email.value ,
      pImage: this.pImageName , 
      cImage : this.cImageName , 
      oldPass : f.controls.oldPass.value != '' ? f.controls.oldPass.value : null ,
      newPass : f.controls.newPass.value != '' ? f.controls.newPass.value : null
    }

    if(f.controls.email.errors) alert('please enter valid email')
    this.mySub2 = this.updateSer.editInfo(data ,this.pImage , this.cImage).subscribe(err =>{
      if(err && err=='unexpected error') this.router.navigate(['/error'])
      if(err && err['err']) alert('password is wrong !!')
        else{
          alert('data updated successfully :) .. you will be redirected to login') ; 
          localStorage.clear();
          this.store.dispatch({type:'notUser'})
          this.router.navigate(['/login'])
        }
    })

  }

}
