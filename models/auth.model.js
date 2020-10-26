const mongoose = require('mongoose') ; 
const bcrypt = require('bcrypt') ; 
const crypto = require('crypto') ; 
const jwt = require('jsonwebtoken') ;


const userSchema = mongoose.Schema({
    name : String , 
    email : String , 
    password : String , 
    age : Number , 
    isVerified : {
        type : Boolean , 
        dafault : false 
    } ,
    image : {
        type : String , 
        default : 'https://res.cloudinary.com/x4md98/image/upload/v1603749414/default_hqqjr7.png'
    },
    cover : {
        type : String , 
        default : 'https://res.cloudinary.com/x4md98/image/upload/v1603749414/cover_sikfgb.png'
    },
    friends : [{
        id : {type:mongoose.Schema.Types.ObjectId , ref:'user'} ,
        chatId : String ,
        date:Date , 
    }],
    friendRequests : {
        type : [{type:mongoose.Schema.Types.ObjectId , ref:'user'}] ,
        default : []
    } , 
    sentRequests : {
        type : [{type:mongoose.Schema.Types.ObjectId , ref:'user'}] ,
        default : []
    },
    notifications :[{
        notification:String , 
        likeId : String , 
        commentId : String ,
        postId : String ,
        isViewed : false,
        date:Date
    }],
    address : String , 
    verificationKey : {
        type : String , 
        default : null 
    } , 
    posts : {
        type : [{type:mongoose.Schema.Types.ObjectId , ref:'post'}] , 
        default : []
    },
    groups : [{
        admin : {type:mongoose.Schema.Types.ObjectId , ref:'user'}  ,
        groupId : {type:mongoose.Schema.Types.ObjectId , ref:'chat'} ,
        name : String , 
    }]
})

const User = mongoose.model('user' , userSchema) ; 
exports.User = User ;







exports.creatAccount = async userData =>{
  try {
    let userFound = await User.findOne({email:userData.email}) ; 
    if(!userFound) {
        let hashedPass =  await bcrypt.hash(userData.password,10) ; 
        let verificationKey = crypto.randomBytes(32).toString('hex');
        let newUser = new User({
            name : userData.name , 
            email : userData.email , 
            password : hashedPass , 
            age : userData.age , 
            address : userData.address , 
            verificationKey , 
        })
        let user = await newUser.save() ; 
        return {
            user ,
            created : true , 
            text : 'Account has Been created successfully .. please check your email to verify account ' ,
        } ;
    } else {
        return {
            created : false , 
            text : 'This email is repeated '
        } ;
    }
  } catch (error) {
      throw new Error(error)
  }
}



exports.verifyAccount = async (key)=>{
    try {
        const user = await User.findOne({verificationKey:key}) ; 
        if(user) {
            user.verificationKey = null ; 
            user.isVerified = true ;
            await user.save(); 
            return true ; 
        } else {
            return false ; 
        }
    } catch (error) {
        throw new Error(error) ;
    }
}


exports.login = async (email,password) =>{
    try {
        const user = await User.findOne({email}) ; 
        if(user) {
            if(user.isVerified) {
                let same =  await bcrypt.compare(password,user.password) ; 
                if(same) {
                    let token = jwt.sign({
                        id : user.id , 
                        name : user.name , 
                        email : user.email , 
                        image : user.image ,
                        cover : user.cover , 
                    },process.env.SECRET) ;
                    return {
                        success : true , 
                        token ,
                        msg : 'Successfull Login'
                    }
                } else {
                    return {
                        success : false , 
                        msg : 'Incorrect Password'
                    }
                }
            } else {
                return {
                    success : false , 
                    msg : 'Your account is not activated .. check your email'
                }
            }
        }else {
            return {
                success : false , 
                msg : 'Email not found' 
        }
    }
    } catch (error) {
        throw new Error(error)
    }    
}


exports.getUserFriends = async (userId)=>{
    try {
        let f = await User.findById(userId,'friends.id').populate({
            path:'friends.id' , 
            model:'user' , 
            select : 'id name image'
        })
        return f.friends ;
    } catch (error) {
        throw new Error(error)
    }
}


exports.getUsers = async ()=>{
    try {
        let users = await User.find({isVerified:true},'name image') ; 
        return users ;
    } catch (error) {
        throw new Error(error)
    }
}


exports.getChatId =  async(visitorId,profileId) =>{
    try {
        let user = await User.findById(profileId) ; 
        let friends = user.friends ; 
        let found = friends.find(el => el.id == visitorId) ; 
        if(found) return found.chatId ;
    } catch (error) {
        throw new Error(error)
    }
}

exports.getUserInfo = async (id)=>{
    try {
        let user = await User.findById(id ,'name image email address cover') ;
        return user ;
    } catch (error) {
        throw new Error(error)
    }
}


exports.updateUserInfo = async (data)=>{
    //console.log(data)
    try {
        let user = await User.findById(data.id) ; 
        if(data.newPass && data.oldPass){
            let same = await bcrypt.compare(data.oldPass , user.password) ; 
            if(same) user.password = await bcrypt.hash(data.newPass,10) ; 
            else throw new Error('password is wrong !!')
        }
        if(data.pImage) user.image =  data.pImage ; 
        if(data.cImage) user.cover = data.cImage ; 
        user.name = data.name ; 
        user.email = data.email ;
        user.address = data.address ;
        await user.save();
    } catch (error) {
        throw new Error(error)    
    }
}