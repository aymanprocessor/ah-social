import { NotAuthService } from './../../guards/not-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from 'src/app/components/sign-up/sign-up.component';


const routes: Routes = [
  {path:'',component:SignUpComponent , canActivate : [NotAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
