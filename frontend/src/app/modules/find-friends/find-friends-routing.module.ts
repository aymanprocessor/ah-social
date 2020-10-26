import { FindFriendsComponent } from './../../components/find-friends/find-friends.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsAuthService } from 'src/app/guards/is-auth.service';


const routes: Routes = [
  {path:'' , component:FindFriendsComponent , canActivate:[IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindFriendsRoutingModule { }
