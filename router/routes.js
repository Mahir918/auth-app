const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const router = express.Router()

const registerValidator = require('../validator/rigister')
const loginValidator = require('../validator/login')
const User = require('../model/Auth')

router.post('/register',(req,res)=>{
    let {name,email,password,password2} = req.body
    let validate = registerValidator({name,email,password,password2})
    if(!validate.isValid){
        return res.status(400).json(validate.error)
    }else{
    User.findOne({email})
        .then(user => {
            if(user){
                return res.status(404).json({msg: 'Email Alredy Exits!'})
            }
            bcrypt.hash(password,11,(err,hash)=>{
                if(err){
                    res.status(500).json({msg:"Server Error Occurred"})
                }
                let user = new User({
                    name,
                    email,
                    password:hash
                })
                user.save()
                    .then(user => {
                        res.status(201).json({
                            msg: 'User Created Succesfully',
                            user
                        })
                    })
                    .catch(err => {
                        res.status(500).json({msg:"Server Error Occurred"})
                    })
            })
        })
        .catch(err => {
            res.status(500).json({msg:"Server Error Occurred"})
        })
    }
})


router.post('/login',(req,res)=>{
    let {email,password} = req.body
    let validate = loginValidator({email,password})
    if(!validate.isValid){
        return res.status(400).json(validate.error)
    }else{
        User.findOne({email})
            .then(user=>{
                if(!user){
                    return res.status(404).json({msg: 'User Not Found'})
                }
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(err){
                        res.status(500).json({msg:"Server Error Occurred"})
                    }
                    if(!result){
                        return res.status(404).json({msg: 'Password Doesn\'t Match'})
                    }
                    let token = jwt.sign({
                        _id:user.id
                    },'SECRET',{expiresIn:'2h'})
                    res.status(200).json({
                        msg:"Login Succesfully",
                        token: `Bearer ${token}`
                    })
                })
            })
            .catch(err => {
                res.status(500).json({msg:"Server Error Occurred"})
            })
    }

})

module.exports = router