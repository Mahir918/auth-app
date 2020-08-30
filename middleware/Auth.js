const passport = require('passport')

module.exports = (req,res,next) =>{
    passport.authenticate('jwt',(err,user,info)=>{
        if(err) {return next(err)}
        if(!user){
            return res.status(400).json({
                message:'Authenticaton Failed'
            })
        }
        req.user = user
        return next()
    })(req,res,next)
}