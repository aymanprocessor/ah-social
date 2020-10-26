import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { userStateReducer,friendRequestsReducer,friendRequestsResponse ,
   notificationsReducer , onlineStateReducer , chatReducer ,
    joinGroupReducer , groupChatReducer } from './reducers';
import { PostsComponent } from './components/posts/posts.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/friends/friends.component';
import { GroupsComponent } from './components/groups/groups.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FriendRequestsComponent } from './components/friend-requests/friend-requests.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { OnlineComponent } from './components/online/online.component';
import { ErrorComponent } from './components/error/error.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    UpdateProfileComponent,
    NotFoundComponent,
    LoginComponent,
    SignUpComponent,
    PostsComponent,
    ChatComponent,
    FriendsComponent,
    GroupsComponent,
    NotificationsComponent,
    FriendRequestsComponent,
    CreateGroupComponent,
    FindFriendsComponent,
    OnlineComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule , 
    BrowserAnimationsModule, 
    FormsModule , 
    ReactiveFormsModule , 
    HttpClientModule ,
    StoreModule.forRoot({
      userStateReducer,
      friendRequestsReducer,
      friendRequestsResponse ,
      notificationsReducer , 
      onlineStateReducer ,
      chatReducer , 
      joinGroupReducer , 
      groupChatReducer
    }) 
  ],
  providers: [
    { provide: LocationStrategy, useClass:HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
