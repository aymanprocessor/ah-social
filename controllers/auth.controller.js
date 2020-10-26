const authModel = require('../models/auth.model') ; 
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const transport =  nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);



exports.createAccount = (req,res,next) => {
    authModel.creatAccount({
        name : req.body.name , 
        email : req.body.email , 
        password : req.body.password , 
        age : req.body.age , 
        address : req.body.address , 
    }).then(response => {
        if(response.created) {
            transport.sendMail({
                from: 'ah-social@mailna.co',
                to: `${response.user.name} <${response.user.email}>`,
                subject: 'Email Verification',
                html: `
                    <button>
                        <a href='ah-social.herokuapp.com/api/verify/${response.user.verificationKey}'>Click here to verify your account</a>
                    </button>
                `
            }).then(()=>{
                res.json(response) ;
            }).catch(err => res.json('unexpected error'))

        }else {
            res.json(response)
        }
    }).catch(err => res.json('unexpected error')) 
} 




exports.verifyAccount = (req,res,next)=>{
    authModel.verifyAccount(req.params.key).then(verified => {
        if(verified) {
            res.redirect('/')
         }
        else res.json({msg:'Not Verified'}) ;
    }).catch(err => res.json('unexpected error'))
}




exports.login = (req,res,next) => {
    //console.log('here')
    authModel.login(req.body.email , req.body.password).then(resp =>{
        res.json(resp) ; 
    }).catch(err=> res.json('unexpected error'))
} 


exports.getUsers = (req,res)=>{
    authModel.getUsers().then(users =>{
        res.json(users) ; 
    }).catch(err=> res.json('unexpected error'))
}


exports.getChatId = (req,res)=>{
    authModel.getChatId(req.header('visitorId') , req.header('profileId') ).then(chatId =>{
        res.json(chatId) ; 
    }).catch(err=> res.json('unexpected error'))
}


exports.getUserInfo = (req,res)=>{
    authModel.getUserInfo(req.header('id')).then(userInfo =>{
        if(userInfo) res.json(userInfo) 
        else res.json('err')
    }).catch(err =>{
        res.json('err')
        //res.json('unexpected error')
    })
}


