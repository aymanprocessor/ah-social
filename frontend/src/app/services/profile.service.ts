import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  token = localStorage.getItem('token')
  constructor(private httpC:HttpClient) {}

  getPost = (postId)=>{
    let headers = new HttpHeaders().set('id',postId) ;
    return this.httpC.get('api/posts' , {headers})
  }

  getUserInfo = (id)=>{
    let headers = new HttpHeaders().set('id',id) ;
    return this.httpC.get('api/info' , {headers})
  }
  
  getUserPosts(id){
    let headers = new HttpHeaders().set('id',id);
    return this.httpC.get('api/currentUserPosts' , {headers})
  }

  getUserRequests(id){
    let headers = new HttpHeaders().set('id',id);
    return this.httpC.get('api/friends/allRequests' , {headers})
  }
  


  addNewPost(data,imageFile){
    let formData = new FormData(); 
    formData.append('data' , JSON.stringify(data)) ;
    if(imageFile) formData.append('image',imageFile) ;
    return this.httpC.post('api/addNewPost',formData);
  }

  editPost(postId , newText ){
    return this.httpC.patch('api/editPost',{postId,newText});
  }

  deletePost = (userId,postId)=>{
    let headers = new HttpHeaders().set('userId',userId).set('postId',postId);
    return this.httpC.delete('api/deletePost',{headers});
  }
  addLike(userId,postId){
    return this.httpC.post('api/addLike',{userId,postId});
  }

  dislike(userId,ownerId,postId,likeId){
    let headers = new HttpHeaders().set('userId',userId)
    .set('ownerId',ownerId).set('postId',postId).set('likeId',likeId) ;
    return this.httpC.delete('api/dislike',{headers});
  }


  addComment(userId,postId,comment){
    return this.httpC.post('api/addComment',{userId,postId,comment});
  }


  editComment(commentId,postId,newComment){
    return this.httpC.patch('api/editComment',{commentId,postId,newComment});
  }

  deleteComment(commentId,postId){
    let headers = new HttpHeaders().set('commentId',commentId).set('postId',postId) ;
    return this.httpC.delete('api/deleteComment',{headers});
  }

  addFriend(senderId,recieverId){
    return this.httpC.post('api/friends/add',{senderId,recieverId});
  }

  getChatId(visitorId , profileId){
    let headers = new HttpHeaders().set('visitorId' , visitorId).set('profileId',profileId);
    return this.httpC.get('api/chatId',{headers});
  }


}
