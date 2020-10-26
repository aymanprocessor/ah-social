const router = require('express').Router() ; 
const multer = require('multer');
const bodyParserMW = require('body-parser').json() ;
const updateProfileController = require('../controllers/updateProfile.controller') ; 


const multerUploader = multer({
    storage : multer.diskStorage({
        destination : (req,file , cb) =>{
            cb(null,'public/assets/images/')
        } ,
        filename : (req,file , cb)=>{
            cb(null ,Date.now()+'-'+file.originalname)
        } , 
    }) , 
    fileFilter : (req,file,cb)=>{
        if(file.mimetype.startsWith('image/')) cb(null , true) ;
        else {
            cb(null , false) ; 
            cb(new Error('These Types Of Files Are Not Supported')) ; 
        }
    }
})

/*
router.post('/editInfo' , bodyParserMW , 
(req,res,next) =>{

    multerUploader.fields([{name:'pImage'},{name:'cImage'}])(req,res,(err)=>{
        if(err) {
            console.log(err)
            res.json({uploadingErr:err}) ; 
        }
        else {
            next()
        }
    }) ; 

} ,
updateProfileController.updateInfo ) ;
*/

const cloudinary = require('cloudinary').v2 ;
cloudinary.config({
    cloud_name : 'x4md98' , 
    api_key : '467169452594452' , 
    api_secret : 'VM0aHzv7RNz7eGysTu6ow6UmKMY'
})

router.use('/editInfo' , multerUploader.fields([{name:'pImage'},{name:'cImage'}]) , async(req,res,next)=>{

    if(req.files.pImage){
        const result = await cloudinary.uploader.upload(req.files.pImage[0].path) ;
        req.pImage = result.url ;
    }

    if(req.files.cImage){
        const result = await cloudinary.uploader.upload(req.files.cImage[0].path) ;
        req.cImage = result.url ;
    }
    next()
} , updateProfileController.updateInfo )
module.exports = router ;




