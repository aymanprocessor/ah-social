import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FriendsComponent } from 'src/app/components/friends/friends.component';
import { IsAuthService } from 'src/app/guards/is-auth.service';


const routes: Routes = [
  {path:'',component:FriendsComponent , canActivate : [IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule { }
