const router = require('express').Router();
const bodyParserMW = require('body-parser').json();
const authController= require('../controllers/auth.controller') ;
const authGuard = require('./guards/auth.guard')


router.post('/register' ,  authGuard.notAuth ,bodyParserMW , authController.createAccount) ;
router.get('/verify/:key' , authController.verifyAccount) ;
router.post('/login' , authGuard.notAuth  , bodyParserMW , authController.login) ;
router.get('/users' ,  authController.getUsers) ;
router.get('/chatId' ,  authController.getChatId) ;
router.get('/info' , authController.getUserInfo) ;


module.exports = router ; 