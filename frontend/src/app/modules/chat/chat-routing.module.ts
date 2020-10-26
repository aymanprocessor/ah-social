import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { IsAuthService } from 'src/app/guards/is-auth.service';


const routes: Routes = [
  {path:'' , component:ChatComponent , canActivate:[IsAuthService]} , 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
