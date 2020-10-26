const router = require('express').Router() ; 
const bodyParserMW = require('body-parser').json() ;
const multer = require('multer');
const postsController = require('../controllers/posts.controller') ; 
const authGuard = require('./guards/auth.guard')

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



router.get('/posts' ,  postsController.getPost ) ;
router.get('/info' ,  postsController.getUserInfo ) ;
router.get('/allOfCurrent' , postsController.getAllOfCurrentUser ) ; 
router.get('/currentUserPosts' , postsController.getCurrentUserPosts ) ; 

/*
router.post('/addNewPost' , bodyParserMW , 
(req,res,next) =>{
    multerUploader.single('image')(req,res,(err)=>{
        if(err) {
            console.log(err)
            res.json({uploadingErr:err}) ; 
        }
        else {
            next();
        }
    }) 
}
,postsController.addNewPost ) ;
*/

const cloudinary = require('cloudinary').v2 ;
cloudinary.config({
    cloud_name : 'x4md98' , 
    api_key : '467169452594452' , 
    api_secret : 'VM0aHzv7RNz7eGysTu6ow6UmKMY'
})

router.post('/addNewPost'  , multerUploader.single('image') , async(req,res,next)=>{
    //console.log(req.file)
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path) ;
        req.imageURL = result.url ;
    }
    next()
    
} , postsController.addNewPost )

router.patch('/editPost' ,  bodyParserMW ,postsController.editPost ) ;
router.delete('/deletePost' , bodyParserMW ,postsController.deletePost ) ;
router.delete('/dislike' , bodyParserMW ,postsController.dislike );
router.post('/addComment' , bodyParserMW , postsController.addComment);
router.patch('/editComment' , bodyParserMW , postsController.editComment);
router.delete('/deleteComment' , bodyParserMW , postsController.deleteComment);




module.exports = router ;