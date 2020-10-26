import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NavbarService } from 'src/app/services/navbar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit , OnDestroy {

  notifications = [] ;
  response = false ; 
  mySub1 : Subscription ;
	mySub2 : Subscription ;
  
  usId = jwt_decode(localStorage.getItem('token')).id 
  constructor(private navbarSer:NavbarService , private title:Title , private router:Router){
    title.setTitle('notifications')
    this.mySub1 = navbarSer.getNotifications(this.usId).subscribe(notifications =>{
      if(notifications && notifications=='unexpected error') this.router.navigate(['/error'])
      if(Array.isArray(notifications)) this.notifications = notifications ;
      this.notifications.reverse();
      //console.log(notifications)
      this.response = true
  })
}

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if(this.mySub1) this.mySub1.unsubscribe();
    if(this.mySub2) this.mySub2.unsubscribe();
  }


  notificationViewed(id){
    this.mySub2 = this.navbarSer.editNotificationState(this.usId,id).subscribe(resp =>{
      if(resp && resp=='unexpected error') this.router.navigate(['/error'])
      if(resp['msg']) {
        let notificationIndex = this.notifications.findIndex(el => el._id == id) ;
        this.notifications = JSON.parse(JSON.stringify(this.notifications)) // because readOnly problem
        this.notifications[notificationIndex]['isViewed'] = true ;
      }
    })
  }

}
