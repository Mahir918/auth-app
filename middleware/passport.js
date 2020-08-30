const passport = require('passport')

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'SECRET';

module.exports = passport => {
    passport.use(new JwtStrategy(opts,(payload,done)=>{
        User.findOne({_id:payload._id})
        .then(user =>{
            if(!user){
                return done(null,false)
            }else{
                return done(null,user)
            }
        }).catch(error =>{
            return done(error)
        })
    }))
}