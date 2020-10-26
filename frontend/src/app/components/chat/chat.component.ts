import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import { ChatsService } from './../../services/chats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client' ;
import jwt_decode from "jwt-decode";
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css'] ,
})
export class ChatComponent implements OnInit , OnDestroy {

	currentUserInfo;
	chatId;
	chatInfo;
	chatMessages = [];
	recieverInfo;
	socketClient = io();
	//socketClient = io('http://localhost:3000/');
	allChats = []
	currentChat ; 
	response = false ;
	mySub1 : Subscription ;
	mySub2 : Subscription ;
	mySub3 : Subscription ;


	constructor(private rou: ActivatedRoute, private router: Router, private chatService: ChatsService,
		 private store: Store , private title:Title) {
			 title.setTitle('chat')
		this.currentUserInfo = jwt_decode(localStorage.getItem('token')) 

		/* get all chats of user */
		this.mySub1 = chatService.getAllChats(this.currentUserInfo.id).subscribe(resp => {
			this.response = true
			if(resp && resp=='unexpected error') router.navigate(['/error'])
			if (Array.isArray(resp) && resp?.length != 0) {
				this.allChats = resp;
				for (let i = 0; i < this.allChats.length; i++) {
					let splicedIndex = this.allChats[i].chat.users.findIndex(el => el._id == this.currentUserInfo.id);
					this.allChats[i].chat.users.splice(splicedIndex, 1)
					this.currentChat = this.allChats[this.allChats['length'] - 1];
					//if(this.allChats.length != 0) this.allChats.reverse();
				}
			}

			rou.queryParamMap.subscribe(param => {
				if (router.url.endsWith('chat')) {
					$('#1stPart').removeAttr('hidden')
					$('#2ndPart').attr('hidden','')

				} else {
					$('#1stPart').attr('hidden','')
					$('#2ndPart').removeAttr('hidden')
					$(window).scrollTop(9999999)
				}

        		$('#part2').scrollTop(9999999)
				let myPro = async() => {
					let id = await param.get('id');
					return id;
				}

				myPro().then(id => {
          			this.chatId = id;
		  			if (this.allChats?.length == 0 && id == null) router.navigate(['/'])
		  
					if (!id && this.currentChat) {
						//id = this.currentChat?.chat._id;
						this.chatId = this.currentChat?.chat._id;
          			}	
					if(this.chatId){
						this.mySub2 = chatService.getChat(this.chatId).subscribe(chat => {
							if(chat == 'err') router.navigate(['/404'])
							//console.log(chat)
							else{
								this.recieverInfo = chat['chatInfo']['users'].find(el => el._id != this.currentUserInfo.id)
								this.chatMessages = chat['messages'];
							}
						})

						

						
						setTimeout(() => {
							if (id && $('#1stPart') && $('#2ndPart') ) {
								$('#1stPart').attr('hidden','')
								$('#2ndPart').removeAttr('hidden')
							}
							$('#part2').scrollTop(9999999)
							$(window).scrollTop(999999999)
						}, 200);

						
					}
				})


			})

		})


		store.subscribe(data => {
			if (data['chatReducer']['newMessage']) {

				let found = this.chatMessages.find(el => el._id == data['chatReducer']['newMessage']._id )
				if (!found) this.chatMessages.push(data['chatReducer']['newMessage'])
				//console.log(data['chatReducer']['newMessage'])
				setTimeout(() => {
					$('#part2').scrollTop(9999999)
					$(window).scrollTop(9999999)
				}, 0)

			}
		})

    if (this.allChats.length == 0 && this.chatId) $('#2ndPart').show()
		$.when($.ready).then(function () {
			if ($(window).width() <= 800) {
				$('#mobileChat').removeAttr('hidden')
				$('#1stPart').removeAttr('hidden')
			} else $('#defaultChat').removeAttr('hidden')


			$(window).on('resize', function () {
				if ($(window).width() <= 800) {
					$('#mobileChat').removeAttr('hidden')
					$('#defaultChat').attr('hidden','')
				} else {
					$('#defaultChat').removeAttr('hidden')
					$('#mobileChat').attr('hidden','')
				}

			})

			$('#1stPart').on('click', function () {
				$('#1stPart').attr('hidden','');
				$('#2ndPart').removeAttr('hidden')
			})
		})

	}

	ngOnInit(): void {}
	ngOnDestroy(){
		if(this.mySub1) this.mySub1.unsubscribe();
		if(this.mySub2) this.mySub2.unsubscribe();
	}


	sendMsg(f: NgForm) {
		let newMessage = f.controls.newMessage.value;
		let data = {
			chatId: this.chatId,
			senderId: this.currentUserInfo.id,
			recieverId: this.recieverInfo._id,
			content: newMessage,
		}

		this.socketClient.emit('newMsg', data);
		f.reset();

	}

}