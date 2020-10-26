const router = require('express').Router() ; 
const bodyParserMW = require('body-parser').json() ;
const friendsController = require('../controllers/friends.controller') ; 
const authGuard = require('./guards/auth.guard')

router.get('/'  ,friendsController.getFriends)
router.get('/notifications' , friendsController.getNotifications)
router.post('/editNotifications' , bodyParserMW , friendsController.editNotification)
router.get('/requests' , friendsController.getFriendRequsets)
router.get('/sentRequests' , friendsController.getSentRequsets)
router.get('/allRequests' ,  friendsController.getRequests)
router.post('/add' ,  bodyParserMW , friendsController.addFriendRequest)
router.post('/cancel' ,  bodyParserMW , friendsController.cancelFriendRequest)
router.post('/confirm' ,  bodyParserMW , friendsController.confirmFriendRequest)
router.post('/remove' , bodyParserMW , friendsController.removeFriend)

module.exports = router ;