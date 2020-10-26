import { IsAuthService } from './../../guards/is-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from 'src/app/components/profile/profile.component';


const routes: Routes = [
  {path:'',component:ProfileComponent , canActivate : [IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
