import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit , OnDestroy {

  mySub1 : Subscription ;
  response
	
  constructor(private authSer:AuthService , private title:Title , private router:Router){
    title.setTitle('sign-up')
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
  }

  

  msgSuccess
  msgFailed
  onSubmit(f:NgForm){
    this.response = false ; 
    const fields = f.controls ; 
    this.mySub1 = this.authSer.creatAccount({
      name:fields.name.value , 
      email:fields.email.value , 
      password:fields.password.value , 
      age : fields.age.value ,
      address : fields.address.value 
    }).subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      this.response = true ;
      if(resp['created']== true) this.msgSuccess = resp['text'] ; 
      else this.msgFailed = resp['text'] ;
      f.reset();
    })
  }

}
