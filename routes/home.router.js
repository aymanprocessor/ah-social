const router = require('express').Router();
const authGuard = require('./guards/auth.guard')


router.get('/' , authGuard.isAuth , (req,res)=>{
    res.json({
        isAuthorized : true
    })
})

module.exports = router ; 