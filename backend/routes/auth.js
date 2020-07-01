const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const{JWT_SECRET} = require('../keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const requireLogin = require('../middleware/requireLogin')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email||!password||!name){
         return res.status(422).json({error:"All fields are mandatory"})
    }
     User.findOne({email:email})
     .then ((savedUser)=>{
         if(savedUser){
             return res.status(422).json({error:"User alreasy exist with the same email"})
         }

         bcrypt.hash(password,12)
         .then(hashedpassword=>{

            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
           .then(user=>{
            transporter.sendMail({
                    to:user.email,
                    from:"no-reply@appogram.com",
                    subject:"Signup Success",
                    html:"<h1>Welcome To Appogram</h1>"
                })
               res.json({message:"Saved Successfully"})
           })
           .catch(err=>{
               console.log(err)
           })

         })
         
    })
        .catch(err=>{
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const{email,password}= req.body
    if(!email || !password){
        return res.status(422).json({error:"Please provide your email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successfully Logged In"})
                const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with this Email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@appogram.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"Check your email"})
            })

        })
    })
})


router.post('/new-password',(req,res)=>{
   const newPassword = req.body.password
   const sentToken = req.body.token
   User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(user=>{
       if(!user){
           return res.status(422).json({error:"Try again session expired"})
       }
       bcrypt.hash(newPassword,12).then(hashedpassword=>{
          user.password = hashedpassword
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then((saveduser)=>{
              res.json({message:"Password updated success"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
})

module.exports = router