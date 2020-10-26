import { IsAuthService } from './../../guards/is-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateGroupComponent } from 'src/app/components/create-group/create-group.component';
import { GroupsComponent } from 'src/app/components/groups/groups.component';


const routes: Routes = [
  {path:'',component:GroupsComponent , canActivate : [IsAuthService]} , 
  {path:'new',component:CreateGroupComponent , canActivate: [IsAuthService]} , 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
