const {updateUserInfo} = require('../models/auth.model')

exports.updateInfo = (req,res) =>{

    let data = JSON.parse(req.body.data) ; 
    //console.log(req.files)
    if(req.pImage&& !req.cImage){
        data.pImage = req.pImage ;
        data.cImage = null ;
    }else if(req.cImage&& !req.files.pImage){
        data.cImage = req.cImage ;
        data.pImage = null ;
    }else if (req.files.cImage && req.files.pImage){
        data.pImage = req.files.pImage ;
        data.cImage = req.files.cImage ;
    }

    updateUserInfo(data).then(() =>{
        res.json()
    }).catch(err => {
        //res.json('unexpected error')
        res.json({err:'password is wrong !!'})
        //res.json('unexpected error')
    })
    


}