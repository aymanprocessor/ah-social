import { FriendRequestsComponent } from './../../components/friend-requests/friend-requests.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsAuthService } from 'src/app/guards/is-auth.service';


const routes: Routes = [
  {path:'' , component:FriendRequestsComponent , canActivate:[IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendRequestsRoutingModule { }
