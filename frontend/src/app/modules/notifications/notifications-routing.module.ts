import { IsAuthService } from './../../guards/is-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';


const routes: Routes = [
  {path:'' , component:NotificationsComponent , canActivate : [IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
