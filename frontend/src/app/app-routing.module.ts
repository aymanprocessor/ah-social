import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { HomeComponent } from './components/home/home.component';



const routes: Routes = [
  {path:'',loadChildren:()=> import('./modules/home/home.module').then(module => module.HomeModule)},
  {path:'error' , component : ErrorComponent} ,
  {path:'find-friends' , loadChildren:()=> import('./modules/find-friends/find-friends.module').then(module => module.FindFriendsModule)} ,
  {path:'online' , loadChildren:()=> import('./modules/online/online.module').then(module => module.OnlineModule)} ,
  {path:'profile',loadChildren:()=> import('./modules/profile/profile.module').then(module => module.ProfileModule)} ,
  {path:'update-profile',loadChildren:()=> import('./modules/update-profile/update-profile.module').then(module => module.UpdateProfileModule)} ,
  {path:'posts',loadChildren:()=> import('./modules/posts/posts.module').then(module => module.PostsModule)} ,
  {path:'chat',loadChildren:()=> import('./modules/chat/chat.module').then(module => module.ChatModule)} ,
  {path:'notifications',loadChildren:()=> import('./modules/notifications/notifications.module').then(module => module.NotificationsModule)} ,
  {path:'friend-requests',loadChildren:()=> import('./modules/friend-requests/friend-requests.module').then(module => module.FriendRequestsModule)} ,
  {path:'groups',loadChildren:()=> import('./modules/groups/groups.module').then(module => module.GroupsModule)} ,
  {path:'friends',loadChildren:()=> import('./modules/friends/friends.module').then(module => module.FriendsModule)} ,
  {path:'login',loadChildren:()=> import('./modules/login/login.module').then(module => module.LoginModule)} ,
  {path:'sign-up',loadChildren:()=> import('./modules/sign-up/sign-up.module').then(module => module.SignUpModule)} ,
  {path:'**',loadChildren:()=> import('./modules/not-found/not-found.module').then(module => module.NotFoundModule)},   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
