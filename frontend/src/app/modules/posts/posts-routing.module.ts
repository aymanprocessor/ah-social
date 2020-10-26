import { IsAuthService } from './../../guards/is-auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/components/posts/posts.component';


const routes: Routes = [
  {path:'',component:PostsComponent , canActivate : [IsAuthService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
