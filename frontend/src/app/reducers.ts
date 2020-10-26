import { Action } from '@ngrx/store';

let initState1 = {
    isUser :  localStorage.getItem('token') ? true : false 
}

export function userStateReducer (state=initState1 , action:Action){
    switch (action.type) {
        case 'isUser': {
            return {
                isUser : true
            } ;
        }

        case 'notUser': {
            return {
                isUser : false
            } ;
        }
        
        default: {
            return state ;
        }
            
    }

}
////////////////////////////////////////////////////////
let initalState2 = {
    type : '' , 
    requestData :{}
}

export function friendRequestsReducer (state=initalState2, action:Action){
    switch (action.type) {
        case 'add': {
            return {
                type:'add' , 
                requestData:action['payload']
            }
        }

        case 'cancel': {
            return {
                type:'cancel' , 
                requestData:action['payload']
            }
        }

        default: {
            return state ;
        }
            
    }

}


////////////////////////////////////////////////////////
let initalState3 = {
    name:null
}

export function friendRequestsResponse (state=initalState3, action:Action){
    switch (action.type) {
        case 'addRequestSent': return {name:action.type} 
        case 'addRequestRecieved': return {name:action.type}
        case 'requestCanceled': return {name:action.type}
        case 'requestCanceledSuccessfully': return {name:action.type}
        case 'requestConfirmedS': return {name:action.type}
        case 'requestConfirmed': return {name:action.type}
        case 'requestRejectedS': return {name:action.type}
        case 'requestRejected': return {name:action.type}
        case 'removingDone': return {name:action.type} 
        case 'youRemoved': return {name:action.type} 
        default: return state 
    }
}

/////////////////////////////////////////////////////////////


let initalState4 = {
    notificationType : '' ,
    newNotification : '' ,
    postId : '' ,
    postOwner : '' ,
    adder : ''
}

export function notificationsReducer (state=initalState4, action:Action){
    switch (action.type) {
        case 'likeAdded' : return {
            notificationType : action.type ,
            newNotification : action['payload'].notification ,
        } 
        case 'likeAddedS' : return {
            notificationType : action.type ,
            postId : action['payload'].postId ,   
            likeId : action['payload'].notification['likeId']
        }
        case 'disliked' : return {
            notificationType : action.type ,
            likeId : action['payload']['likeId']
        }
        case 'dislikedS' : return {
            notificationType : action.type ,
            postId : action['payload'].postId ,
        }
        case 'commentAddedS': return {
            notificationType : action.type ,
            postId : action['payload'].postId ,
            comment : action['payload'].comment ,
        }
        case 'commentAdded': return {
            notificationType : action.type ,
            newNotification : action['payload'].notification ,
        }
        case 'commentDeletedS': return {
            notificationType : action.type ,
            commentId : action['payload']['commentId'],
            postId : action['payload'].postId ,
        }
        case 'commentDeleted': return {
            notificationType : action.type ,
            commentId : action['payload']['commentId']
        }
        default: return state 
    }
}



////////////////////////////////////////////////////////////


let initalState5 = {
    onlineFriends : []
}

export function onlineStateReducer (state=initalState5, action:Action){
    switch (action.type) {
        case 'onlineFriends': return {
            onlineFriends : action['payload']
        }
        case 'friendGotOnline' : return {
            newOnlineFriend : action['payload']
        }
        case 'friendGotOffline' : return {
            newOfflineFriend : action['payload']
        }
        default: return state ;   
    }
}

////////////////////////////////////////////////////////////

let initalState6 = {
    newMessage : null
}

export function chatReducer (state=initalState6, action:Action){
    switch (action.type) {
        case 'newMsg': return {
            newMessage : action['payload']
        }
        default: return state ;   
    }
}

////////////////////////////////////////////////////////////

let initalState7 = {
    isJoined : false
}

export function joinGroupReducer (state=initalState7, action:Action){
    switch (action.type) {
        case 'joinGroup': return {
            isJoined : true
        }
        default: return state ;   
    }
}

////////////////////////////////////////////////////////////

let initalState8 = {
    newMsg : null
}

export function groupChatReducer (state=initalState8, action:Action){
    switch (action.type) {
        case 'newGbMsg': return {
            newMsg : action['payload']
        }
        default: return state ;   
    }
}






