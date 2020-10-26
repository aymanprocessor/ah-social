import { IsAuthService } from './../../guards/is-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateProfileComponent } from 'src/app/components/update-profile/update-profile.component';


const routes: Routes = [
  {path:'',component:UpdateProfileComponent , canActivate : [IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateProfileRoutingModule { }
