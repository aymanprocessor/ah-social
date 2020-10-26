const router = require('express').Router();
const bodyParser = require('body-parser').json()
const chatController = require('../controllers/chat.controller') ;
const authGuard = require('./guards/auth.guard')

router.get('/chat' , chatController.getChat )
router.get('/allChats' , chatController.getAllChats )
router.post('/newMsg' , bodyParser , chatController.addNewMessage )

router.post('/createGroup' , bodyParser , chatController.createGroup )
router.post('/joinGroup' ,bodyParser , chatController.joinGroup )
router.get('/groups' , chatController.getGroups )






module.exports = router ;