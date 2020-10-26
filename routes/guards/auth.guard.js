const jwt = require('jsonwebtoken') ; 

exports.isAuth = (req,res,next)=>{
    try {
        let token = jwt.verify(req.header('token'),process.env.SECRET) ; 
        next();
    } catch (error) {
        res.json({
            isAuthorized : false
        })
    }
}


exports.notAuth = (req,res,next) =>{
    try {
        let token = jwt.verify(req.header('token'),process.env.SECRET) ; 
        res.json({
            isAuthorized : false 
        })
    } catch (error) {
        next();
    }
}